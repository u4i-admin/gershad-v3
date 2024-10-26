from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

from leaflet.admin import LeafletGeoAdminMixin

from main.models import DatedMixin


class PointOfInterest(LeafletGeoAdminMixin, DatedMixin):
    """
    A class to represent a point of interest
    """

    token = models.CharField(
        max_length=55)

    address = models.TextField()

    arn = models.CharField(
        max_length=255)

    location = gis_models.PointField()

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
    def find_by_center_point(cls, point, radius=None):
        """Find POIs by distance to a Point

        Args:
            point (Point): Center point
            radius (integer, optional): Distance to the center. Defaults to None.

        Returns:
            queryset: List of POIs within the circle
        """
        if radius is None:
            radius = settings.REPORT_RADIUS_M

        return PointOfInterest.objects.filter(location__distance_lte=(point, D(m=radius)))

    @classmethod
    def find_by_center(cls, latitude, longitude, radius=None):
        """Find POIs by distance to a latitude, longitude as its center

        Args:
            latitude (float): Latitude value
            longitude (float): Longitude value
            radius (float, optional): Distance to the center. Defaults to None.

        Returns:
            queryset: List of POIs within the circle
        """
        if radius is None:
            radius = settings.REPORT_RADIUS_M

        center = Point((longitude, latitude), srid=settings.SRID)
        return PointOfInterest.find_by_center(center, radius)
