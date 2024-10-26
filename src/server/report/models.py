from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.db.models import Collect, Count
from django.contrib.gis.geos import Polygon, Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import SnapToGrid, Centroid

from main.models import DatedMixin


class ReportType(models.Model):
    """
    Different Report Types coming from users
    """

    name = models.CharField(
        max_length=16)

    description = models.TextField(
        null=True,
        blank=True)
    # VAN = 'VAN', 'Van'
    # STOP = 'STOP', 'Stop'
    # GASHT = 'GASHT', 'Gasht'
    # NS = 'NS', 'Not Specified'

    def __str__(self):
        return self.name


class ClientType(models.TextChoices):
    ANDROID = 'ANDROID', 'Android'
    IOS = 'IOS', 'iOS'
    TELEGRAM = 'TELEGRAM', 'Telegram Bot'
    WEB = 'WEB', 'Website'
    ADMIN = 'ADMIN', 'Admin'
    NA = 'NA', 'Not Available'


class Reporter(DatedMixin):
    """
    Class to represent a reporter
    """

    client = models.CharField(
        max_length=16,
        choices=ClientType.choices,
        default=ClientType.NA)

    reputation = models.FloatField(
        default=settings.DEFAULT_REPUTATION)

    token = models.CharField(
        max_length=55)


class Report(DatedMixin):
    """
    Class to represent a report from user
    """

    address = models.TextField()

    description = models.TextField(
        null=True,
        blank=True)

    type = models.ForeignKey(
        ReportType,
        on_delete=models.CASCADE,
        related_name='reports')

    deleted = models.BooleanField(
        default=False)

    verified = models.BooleanField(
        default=False)

    location = gis_models.PointField()

    reporter = models.ForeignKey(
        Reporter,
        on_delete=models.SET_NULL,
        related_name='reports',
        null=True,
        blank=True)

    permanent = models.BooleanField(
        default=False
    )

    requested = models.DateTimeField(
        default=timezone.now)

    def __str__(self):
        return str(self.location.coords)

    @property
    def coordinates(self):
        return self.location.coords

    @property
    def longitude(self):
        return self.location.x

    @property
    def latitude(self):
        return self.location.y

    @classmethod
    def find_by_bounding_box(cls, east, west, north, south, after=None):
        """
        Find reports by bounding box
        """
        box = Polygon.from_bbox((west, south, east, north))
        reports = Report.objects.all()
        if after:
            reports = reports.filter(modified__gte=after)
        reports = reports.filter(location__within=box)
        return reports

    @classmethod
    def find_by_center(cls, latitude, longitude, after=None, radius=None):
        """
        Find reports by distance to center
        """
        if radius is None:
            radius = settings.REPORT_RADIUS_M

        center = Point((longitude, latitude), srid=settings.SRID)
        return (Report
                .objects
                .filter(modified__gte=after)
                .filter(location__distance_lte=(center, D(m=radius))))

    @classmethod
    def find_and_cluster(cls, grid_size=None, after=None, **kwargs):
        """
        Find all reports and cluster using snap to grid
        """
        if grid_size is None:
            grid_size = settings.GRID_SIZE

        if after is None:
            # Defaults to a month
            after = timezone.now() - timezone.timedelta(days=30)

        reports = (Report
                   .objects
                   .filter(modified__gte=after)
                   .filter(**kwargs)
                   .annotate(snapped=SnapToGrid('location', grid_size))
                   .annotate(count=Count('location')))
        return reports

    @classmethod
    def find_by_box_and_cluster(cls, east, west, north, south, grid_size=None, after=None):
        """
        Find reports by bounding box and cluster
        using snap to grid
        """
        if grid_size is None:
            grid_size = settings.GRID_SIZE

        if after is None:
            after = timezone.now() - timezone.timedelta(days=settings.REPORT_EXPIRATION_DAYS)

        reports = (Report
                   .find_by_bounding_box(east, west, north, south, after)
                   .annotate(snapped=SnapToGrid('location', grid_size))
                   .annotate(center=Centroid(Collect('location')))
                   .annotate(count=Count('location')))

        return reports

    @classmethod
    def find_by_center_and_cluster(cls, latitude, longitude, grid_size=None, after=None, radius=None):
        """
        Find reports by bounding box and cluster
        using snap to grid
        """
        if grid_size is None:
            grid_size = settings.GRID_SIZE

        if after is None:
            after = timezone.now() - timezone.timedelta(days=settings.REPORT_EXPIRATION_DAYS)

        reports = (Report
                   .find_by_center(latitude, longitude, after, radius)
                   .annotate(snapped=SnapToGrid('location', grid_size))
                   .annotate(center=Centroid(Collect('location')))
                   .annotate(count=Count('location')))

        return reports
