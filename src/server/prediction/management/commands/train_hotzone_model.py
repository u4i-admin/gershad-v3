from django.core.management.base import BaseCommand

from prediction.models import (
    WeeklyPeriod,
    TrainingData,
    DBSCANModel
)
from prediction.utils import (
    train_dbscan_model,
    create_trained_model_object,
    reset_weekly_periods
)


class Command(BaseCommand):
    """
        Train the hotzone algorithm (takes DBSCAN algorithm
        hyparameters as optional arguments)

        This command looks at the first (and only, unless something’s wrong)
        instance of TrainingData and trains the model if
        run_next_cron is True.

        If the --force argument is passed to the command, the command
        will run even if it hasn’t been requested by the app code.
    """

    help = 'Train the hotzone algorithm if it has been requested.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true'
        )
        parser.add_argument(
            "--convert_coords_to_rad",
            type=int,
            help='1 for True, 0 for False. Defaults to True to convert reports coordinates to radians.')
        parser.add_argument(
            "--metric",
            type=str,
            help='Defaults to "haversine".\
            The metric to use when calculating distance between\
            instances in a feature array. If metric is a string or\
            callable, it must be one of the options allowed by \
            sklearn.metrics.pairwise_distances for its metric parameter.\
            If metric is “precomputed”, X is assumed to be \
            distance matrix and must be square. X may be a\
            sparse graph, in which case only “nonzero”\
            elements may be considered neighbors for DBSCAN.')
        parser.add_argument(
            "--metric_params",
            type=dict,
            help='Additional keyword arguments for the metric function.')
        parser.add_argument(
            "--algorithm",
            type=str,
            help='Defaults to "ball_tree".\
            The algorithm to be used by the NearestNeighbors module to compute\
            pointwise distances and find nearest neighbors.')
        parser.add_argument(
            "--leaf_size",
            type=int,
            help='Leaf size passed to BallTree or cKDTree.')
        parser.add_argument(
            "--p",
            type=float,
            help='The power of the Minkowski metric to be used to calculate\
            distance between points. If None, then p=2\
            (equivalent to the Euclidean distance).')
        parser.add_argument(
            "--n_jobs",
            type=int,
            help='The number of parallel jobs to run. None means 1 unless\
              in a joblib.parallel_backend context.\
                  -1 means using all processors.')

    def handle(self, *args, **options):

        training_data = TrainingData.objects.first()
        if not training_data:
            self.stdout.write('Training data has not been set. Skipping the job.')
            return

        if not options['force'] and not training_data.run_next_cron:
            self.stdout.write('Training has not been requested. Skipping the job.')
            return

        convert_coords = bool(options['convert_coords_to_rad'])\
            if options['convert_coords_to_rad'] else True

        metric = options['metric']\
            if options['metric'] else 'haversine'

        metric_params = options['metric_params']\
            if options['metric_params'] else None

        algorithm = options['algorithm']\
            if options['algorithm'] else 'ball_tree'

        leaf_size = options['leaf_size']\
            if options['leaf_size'] else 30

        p = bool(options['p'])\
            if options['p'] else None

        n_jobs = options['n_jobs']\
            if options['n_jobs'] else None

        kwargs = {
            'convert_coords': convert_coords,
            'eps': training_data.eps,
            'min_samples': training_data.min_samples,
            'metric': metric,
            'metric_params': metric_params,
            'algorithm': algorithm,
            'leaf_size': leaf_size,
            'p': p,
            'n_jobs': n_jobs
        }

        DBSCANModel.objects.all().delete()
        trained_model_data = train_dbscan_model(
            training_data, **kwargs)
        if not trained_model_data:
            self.stdout.write(
                self.style.WARNING(
                    'Warning: No clusters found with the parameters specified.'))
            return
        elif training_data.clusters_by_period:
            # Reset weekly periods if clusters_by_period is selected
            reset_weekly_periods(
                training_data)
            # Train a model for each period
            for period in WeeklyPeriod.objects.all():
                create_trained_model_object(
                    training_data, period, trained_model_data)
            self.stdout.write(
                self.style.SUCCESS(
                    'Done. Check the admin panel for results.'))
        else:
            create_trained_model_object(
                training_data, None, trained_model_data)
            self.stdout.write(
                self.style.SUCCESS(
                    'Done. Check the admin panel for results.'))
