import datetime

from django.conf import settings
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.utils import timezone

import pandas as pd
import numpy as np
from sklearn import metrics
from sklearn import preprocessing
from sklearn.cluster import DBSCAN
from geopy.distance import great_circle
from shapely.geometry import MultiPoint
from shapely.errors import GEOSException

from report.models import Report
from prediction.models import ClusterGroup, DBSCANModel, WeeklyPeriod


def get_centermost_point(cluster):
    """
    From https://github.com/gboeing/2014-summer-travels/blob/master/clustering-scikitlearn.ipynb
    DBSCAN clusters may be non-convex. This technique just returns one
    representative point from each cluster. First get the lat,lon coordinates
    of the cluster's centroid. Then find the member of the cluster with the
    smallest great circle distance to the centroid.
    """
    try:
        centroid = (MultiPoint(cluster).centroid.x, MultiPoint(cluster).centroid.y)
        centermost_point = min(cluster, key=lambda point: great_circle(point, centroid).m)
        return tuple(centermost_point)
    except GEOSException:
        # Empty point
        return None


def preprocess_data(training_data):
    """Prepare the reports data based on the training period

    Args:
        training_data: TrainingData instance

    Returns:
        (reports, data, labels): tuple that has reports, dataframe and labels\
              to train the model with.
        or None if no reports found for the period specified
    """

    target_date = timezone.now() - timezone.timedelta(
        days=training_data.training_days)

    today = timezone.now().replace(minute=0, second=0, microsecond=0)

    reports = Report.objects.filter(
        requested__gte=target_date,
        requested__lt=today)

    if not reports:
        return None

    reports_data = []
    for report in reports:
        reports_data.append(
            {
                'pk': report.pk,
                'latitude': report.latitude,
                'longitude': report.longitude,
                'type': report.type,
                'requested': report.requested,
            }
        )
    # Converting queryset and processing data
    df = pd.DataFrame.from_records(reports_data)

    label_encoding = preprocessing.LabelEncoder()
    df['type'] = label_encoding.fit_transform(df['type'].astype(str))

    data = df.drop(columns=['pk', 'type', 'requested'])
    labels = df['type']

    return (reports_data, data, labels)


def check_period(report, period):
    """Checks whether a report belongs to a WeeklyPeriod instance

    Args:
        report: dict (from preprocess_data())
        period: WeeklyPeriod instance
    Returns:
        bool
    """
    if not period:
        # We are not checking period
        return True

    report_date = report['requested']

    # Move report_date to same year to get week difference
    replaced_report_date = report_date.replace(year=period.start_date.year)
    week_difference = period.start_date.isocalendar().week - replaced_report_date.isocalendar().week

    # Shift report_date to same week as WeeklyPeriod
    shifted_report_date = replaced_report_date + datetime.timedelta(weeks=week_difference)

    # Check if report belings to the period
    if period.start_date <= shifted_report_date <= period.end_date:
        return True

    return False


def train_dbscan_model(training_data, **kwargs):  # noqa C901
    """Train a model using DBSCAN clustering algorithm

    Args:
        training_data: TrainingData instance
        expected kwargs:
            convert_coords: bool, True to convert reports\
                coordinates to radians
            metric , metric_params ,\
                algorithm , leaf_size , p , n_jobs: hyperparameters
    Returns:
        tuple:(
            filtered_reports,
            params,
            homogeneity_score,
            completeness_score,
            v_measure_score,
            adjusted_rand_score,
            adjusted_mutual_info_score,
            silhouette_score
        )
    """

    try:
        reports, data, labels = preprocess_data(training_data)
    except TypeError:
        # No reports for the specified period found
        return None

    # Represent points as (lat, lon)
    deg_coords = coords = data.values

    if kwargs:
        # Params sent by management command
        if kwargs['convert_coords']:
            coords = np.radians(coords)
            kwargs['eps'] = kwargs['eps'] / 6371.0088
        kwargs.pop('convert_coords')
        params = kwargs
    else:
        # Default values
        # Based on https://github.com/gboeing/2014-summer-travels/blob/master/clustering-scikitlearn.ipynb
        coords = np.radians(coords)
        params = dict(
            eps=training_data.eps / 6371.0088,
            min_samples=training_data.min_samples,
            algorithm='ball_tree',
            metric='haversine')

    model = DBSCAN(**params).fit(coords)

    cluster_labels = model.labels_
    num_clusters = len(set(cluster_labels))

    if num_clusters <= 2 or num_clusters >= len(reports):
        # Invalid values
        return None

    # Evaluating trained model
    homogeneity_score = metrics.homogeneity_score(labels, cluster_labels)
    completeness_score = metrics.completeness_score(labels, cluster_labels)
    v_measure_score = metrics.v_measure_score(labels, cluster_labels)
    adjusted_rand_score = metrics.adjusted_rand_score(labels, cluster_labels)
    adjusted_mutual_info_score = metrics.adjusted_mutual_info_score(labels, cluster_labels)
    silhouette_score = metrics.silhouette_score(data, cluster_labels)

    # Creating the models for the clusters

    reports_labels = cluster_labels.tolist()

    for i in range(len(reports_labels)):
        reports[i]['label'] = reports_labels[i]

    # turn the clusters in to a pandas series, where each element is a cluster of points
    clusters = pd.Series(
        [deg_coords[cluster_labels == n] for n in range(num_clusters)])
    centermost_points = clusters.map(get_centermost_point)

    # centermost_points.array: ndarray of shape(n_clusters, n_features)\
    # i.e [[lon1, lat1], [lon2, lat2], ...]
    centroids = []
    for c in centermost_points.array:
        if c:
            centroids.append(Point((c[1], c[0]), srid=settings.SRID))
        else:
            centroids.append(None)

    return (
        reports,
        centroids,
        params,
        homogeneity_score,
        completeness_score,
        v_measure_score,
        adjusted_rand_score,
        adjusted_mutual_info_score,
        silhouette_score
    )


def create_trained_model_object(training_data, period, trained_model_data):  # noqa C901
    """Creates trained model object in the database using DBSCAN trained model

    Args:
        training_data: TrainingData instance
        period: WeeklyPeriod instance
        trained_model_data: returned values of train_dbscan_model()
    Returns:
        DBSCAN model or None
    """
    try:
        (
            reports,
            centroids,
            params,
            homogeneity_score,
            completeness_score,
            v_measure_score,
            adjusted_rand_score,
            adjusted_mutual_info_score,
            silhouette_score
        ) = trained_model_data
    except TypeError:
        # Model could not be trained
        return None

    trained_model, created = DBSCANModel.objects.get_or_create(
        training_data=training_data,
        period=period)

    # Delete all cluster groups associated with this model and create new groups
    ClusterGroup.objects.filter(trained_model=trained_model).delete()

    for i, centroid in enumerate(centroids):
        reports_pks = [
            report['pk'] for report in reports if (report['label'] == i and check_period(report, period))]
        if len(reports_pks) < training_data.min_cluster_reports:
            # We skip creating clusters with less than min_samples
            continue
        if training_data.outliers_included:
            cluster_reports = Report.objects.filter(
                pk__in=reports_pks)
        else:
            cluster_reports = Report.objects.filter(
                pk__in=reports_pks,
                location__distance_lte=(
                    centroid,
                    D(m=training_data.eps * 1000)))

        if cluster_reports.count() >= training_data.min_cluster_reports:
            cluster = ClusterGroup.objects.create(
                centroid_location=centroid,
                trained_model=trained_model)
            cluster.reports.set(cluster_reports)
            cluster.save()

    if trained_model.cluster_groups.exists():
        trained_model.num_clusters = trained_model.cluster_groups.count()
        trained_model.eps = params['eps']
        trained_model.min_samples = params['min_samples']
        trained_model.algorithm = params['algorithm']
        trained_model.metric = params['metric']
        trained_model.metric_params = params['metric_params'] if 'metric_params' in params else None
        trained_model.leaf_size = params['leaf_size'] if 'leaf_size' in params else 30
        trained_model.p = params['p'] if 'p' in params else None
        trained_model.n_jobs = params['n_jobs'] if 'n_jobs' in params else None
        trained_model.homogeneity_score = homogeneity_score
        trained_model.completeness_score = completeness_score
        trained_model.v_measure_score = v_measure_score
        trained_model.adjusted_rand_score = adjusted_rand_score
        trained_model.adjusted_mutual_info_score = adjusted_mutual_info_score
        trained_model.silhouette_score = silhouette_score

        trained_model.save()

        # Disable running the job at next cron
        if training_data.run_next_cron:
            training_data.run_next_cron = False
            training_data.save(update_fields=['run_next_cron'])

        return trained_model

    trained_model.delete()
    return None


def reset_weekly_periods(data):
    """Updates WeeklyPeriods based on given training data

    Args:
        data: TrainingData instance
    """

    starting_weekday = data.starting_weekday
    starting_time = data.starting_time
    today = datetime.datetime.today().replace(hour=starting_time, minute=0, second=0, microsecond=0)
    monday = today - datetime.timedelta(days=today.weekday())
    start = monday + datetime.timedelta(days=starting_weekday)
    end = start + datetime.timedelta(days=7)
    before_hours = data.period_overlap_start
    after_hours = data.period_overlap_end
    interval = data.period_interval
    periods_count = 168 / interval
    diff = (end - start) / periods_count

    # Remove previous periods
    WeeklyPeriod.objects.all().delete()

    for i in range(int(periods_count)):
        start_date = start + diff * i
        end_date = start_date + datetime.timedelta(hours=(interval))
        start_date_overlapped = start_date - datetime.timedelta(hours=before_hours)
        end_date_overlapped = end_date + datetime.timedelta(hours=after_hours)
        WeeklyPeriod.objects.create(
            start_date=start_date_overlapped,
            end_date=end_date_overlapped)
