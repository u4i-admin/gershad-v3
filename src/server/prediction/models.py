from django.db import models
from django.contrib.gis.db import models as gis_models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone

from main.models import DatedMixin
from report.models import Report, ReportType

from prediction.helpers import SingletonModel


class WeeklyPeriod(DatedMixin):
    """
    Class to represent the period of the day
    when the reports take place
    """

    start_date = models.DateTimeField(
        default=timezone.now)

    end_date = models.DateTimeField(
        default=timezone.now)

    def __str__(self):
        return f'{self.start_date.strftime("%a")} {self.start_date.time().strftime("%I %p")} to {self.end_date.strftime("%a")} {self.end_date.time().strftime("%I %p")} '


class TrainingData(SingletonModel):
    """
    Class to represent the training parameters of
    machine learning model
    """

    class Weekday(models.IntegerChoices):
        MONDAY = 0
        TUESDAY = 1
        WEDNESDAY = 2
        THURSDAY = 3
        FRIDAY = 4
        SATURDAY = 5
        SUNDAY = 6

    training_days = models.PositiveIntegerField(
        help_text='Total number of days to use in the training set,\
             i.e. 90 for reports from last 90 days.')

    eps = models.FloatField(
        default=0.65,
        help_text='The maximum distance between two samples (in kms) for one to be\
              considered as in the neighborhood of the other. This is not a\
                  maximum bound on the distances of points within a cluster.')

    min_samples = models.IntegerField(
        default=1,
        help_text='The number of samples in a neighborhood for a point to be\
              considered as a core point. This includes the point itself.')

    min_cluster_reports = models.PositiveIntegerField(
        default=20,
        help_text='Min reports count for a cluster to be considered')

    outliers_included = models.BooleanField(
        default=False,
        help_text='Turning this on will make clusters less dense and less\
            accurate but will show all reports.')

    clusters_by_period = models.BooleanField(
        default=True,
        help_text='Turning this off will show all reports in a cluster\
            regardless of period.')

    starting_weekday = models.PositiveIntegerField(
        default=0,
        choices=Weekday.choices,
        help_text='Requires `Clusters by period` enabled. \
            Otherwise will be disregarded.\
              On what day does the week start? We start dividing periods\
             from that day and time. Works with `Starting Time`.')

    starting_time = models.PositiveIntegerField(
        default=0,
        validators=[
            MaxValueValidator(23),
            MinValueValidator(0)
        ],
        help_text='Requires `Clusters by period` enabled. \
            Otherwise will be disregarded.\
              At what time of the day does the week start?\
            (example: 0 for 12AM, 17 for 5PM) We start dividing periods\
                  from that day and time. Works with `Starting Weekday`.')

    period_interval = models.PositiveIntegerField(
        default=3,
        help_text='Requires `Clusters by period` enabled. \
            Otherwise will be disregarded.\
              Number of hours to divide the week by.\
            For example 3 hours would mean 56 periods.')

    period_overlap_start = models.PositiveIntegerField(
        default=0,
        help_text='Requires `Clusters by period` enabled. \
            Otherwise will be disregarded.\
            Number of hours that overlaps each period with its previous period.')

    period_overlap_end = models.PositiveIntegerField(
        default=0,
        help_text='Requires `Clusters by period` enabled. \
            Otherwise will be disregarded.\
              Number of hours that overlaps each period with its next period.')

    run_next_cron = models.BooleanField(
        default=False)

    def __str__(self):
        return f'{self.training_days} days (eps:{self.eps}, min_samples:{self.min_samples}, min_reports:{self.min_cluster_reports})'

    class Meta:
        verbose_name_plural = 'Training data'


class DBSCANModel(DatedMixin):
    """
    Class to represent the trained model
    """

    training_data = models.ForeignKey(
        TrainingData,
        on_delete=models.CASCADE,
        related_name='dbscan_models',
        null=True,
        blank=True,
        help_text='Reports will be filtered by period before training.')

    period = models.ForeignKey(
        WeeklyPeriod,
        on_delete=models.CASCADE,
        related_name='dbscan_models',
        null=True,
        blank=True,
        help_text='Reports will be filtered by period before training.')

    eps = models.FloatField(
        default=0.5,
        help_text='The maximum distance between two samples for one to be\
              considered as in the neighborhood of the other. This is not a\
                  maximum bound on the distances of points within a cluster.')

    min_samples = models.IntegerField(
        default=5,
        help_text='The number of samplesin a neighborhood for a point to be\
              considered as a core point. This includes the point itself.')

    metric = models.CharField(
        max_length=50,
        default='euclidean',
        help_text='The metric to use when calculating distance between\
            instances in a feature array. If metric is a string or\
            callable, it must be one of the options allowed by \
            sklearn.metrics.pairwise_distances for its metric parameter.\
            If metric is “precomputed”, X is assumed to be \
            distance matrix and must be square. X may be a\
            sparse graph, in which case only “nonzero”\
            elements may be considered neighbors for DBSCAN.')

    metric_params = models.JSONField(
        null=True,
        blank=True,
        default=None,
        help_text='Additional keyword arguments for the metric function.')

    algorithm = models.CharField(
        max_length=10,
        choices=(
            ('auto', 'auto'),
            ('ball_tree', 'ball_tree'),
            ('kd_tree', 'kd_tree'),
            ('brute', 'brute'),
        ),
        default='auto',
        help_text='The algorithm to be used by the NearestNeighbors module to compute\
            pointwise distances and find nearest neighbors.')

    leaf_size = models.IntegerField(
        default=30,
        help_text='Leaf size passed to BallTree or cKDTree.')

    p = models.FloatField(
        null=True,
        default=None,
        help_text='The power of the Minkowski metric to be used to calculate\
            distance between points. If None, then p=2\
            (equivalent to the Euclidean distance).')

    n_jobs = models.IntegerField(
        null=True,
        default=None,
        help_text='The number of parallel jobs to run. None means 1 unless\
              in a joblib.parallel_backend context.\
                  -1 means using all processors..')

    homogeneity_score = models.FloatField(
        null=True,
        default=None,
        help_text='A clustering result satisfies homogeneity if all of its\
              clusters contain only data points which are members of a single\
                  class. Score between 0.0 and 1.0. 1.0 stands for perfectly\
                      homogeneous labeling.'
    )
    completeness_score = models.FloatField(
        null=True,
        default=None,
        help_text='A clustering result satisfies completeness if all the data\
              points that are members of a given class are elements of the\
                same cluster. Score between 0.0 and 1.0. 1.0 stands for\
                      perfectly complete labeling.'
    )

    v_measure_score = models.FloatField(
        null=True,
        default=None,
        help_text='The V-measure is the harmonic mean between homogeneity\
              and completeness. Score between 0.0 and 1.0. 1.0 stands for\
                  perfectly complete labeling.'
    )
    adjusted_rand_score = models.FloatField(
        null=True,
        default=None,
        help_text='Similarity score between -0.5 and 1.0.\
              Random labelings have an ARI close to 0.0. 1.0 stands\
                  for perfect match.'
    )
    adjusted_mutual_info_score = models.FloatField(
        null=True,
        default=None,
        help_text='The AMI returns a value of 1 when the two partitions are\
              identical (ie perfectly matched).\
              Random partitions (independent labellings) have an expected AMI\
                  around 0 on average hence can be negative.'
    )
    silhouette_score = models.FloatField(
        null=True,
        default=None,
        help_text='The best value is 1 and the worst value is -1. \
            Values near 0 indicate overlapping clusters. Negative values\
                  generally indicate that a sample has been assigned to the\
                      wrong cluster, as a different cluster is more similar.'
    )

    class Meta:
        verbose_name_plural = 'DBSCAN Trained Models'
        unique_together = (
            'training_data',
            'period'
        )

    def __str__(self):
        return f'{self.training_data} - {self.period}'


class ClusterGroup(DatedMixin):
    """
    Class to represent a cluster of reports
    """

    centroid_location = gis_models.PointField()

    trained_model = models.ForeignKey(
        DBSCANModel,
        on_delete=models.CASCADE,
        related_name='cluster_groups',
        null=True,
        blank=True,
        help_text='Reports will be filtered by period before training')

    reports = models.ManyToManyField(
        Report,
        related_name='cluster_groups',
        blank=True
    )

    @property
    def count_per_type(self):
        count_per_type = {}
        for type in ReportType.objects.all():
            count_per_type[type.name] = self.reports.filter(type=type).count()
        return count_per_type

    def __str__(self):
        return f'({self.centroid_location.x}, {self.centroid_location.y}) - {self.trained_model}'


class HotZoneCluster(DatedMixin):
    """
    Class to represent a Hot zone cluster
    """

    name = models.CharField(
        max_length=256,
        null=True,
        blank=True)

    centroid_location = gis_models.PointField()

    period = models.ForeignKey(
        WeeklyPeriod,
        on_delete=models.SET_NULL,
        related_name='hotzone_clusters',
        null=True,
        blank=True)

    reports = models.ManyToManyField(
        Report,
        related_name='hotzone_clusters',
        blank=True
    )

    hotzone_level = models.PositiveIntegerField(
        default=1,
        validators=[
            MaxValueValidator(5),
            MinValueValidator(1)
        ],
    )

    is_active = models.BooleanField(
        default=True,
        help_text='If `Is Manual` is not selected, this will change automatically.')

    is_manual = models.BooleanField(
        default=True,
        verbose_name='Permanent')

    @property
    def count_per_type(self):
        count_per_type = {}
        for type in ReportType.objects.all():
            count_per_type[type.name] = self.reports.filter(type=type).count()
        return count_per_type

    def __str__(self):
        return f'({self.centroid_location.x}, {self.centroid_location.y})'
