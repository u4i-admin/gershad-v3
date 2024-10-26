import os
import logging

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from django.conf import settings
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models import Collect, Count
from django.contrib.gis.db.models.functions import SnapToGrid, Centroid

from geopy.geocoders import GoogleV3

import strawberry
import strawberry_django

from main.permissions import CheckCognitoUserMutationExtension
from main.utils import MutationOutput, Messages

from poi.models import PointOfInterest
from report.models import Report
from report.report_group import ReportGroupList
from report.schema import ReportGroupNode, PointFieldType


logger = logging.getLogger()


@strawberry_django.type(
    PointOfInterest, pagination=True)
class PointOfInterestNode(strawberry.relay.Node):
    """
    Relay: Point of InterestPoint of Interest Node
    """
    pk: int
    token: strawberry.auto
    address: strawberry.auto
    arn: strawberry.auto
    location: PointFieldType
    requested: strawberry.auto
    created: strawberry.auto
    modified: strawberry.auto


@strawberry.type
class PointOfInterestQuery:
    """
    Point of Interest Query definition
    """

    @strawberry.field
    def point_of_interest(
        self,
        pk: int,
        token: str,
    ) -> Optional[PointOfInterestNode]:
        poi = None
        try:
            poi = PointOfInterest.objects.get(pk=pk, token=token)
        except PointOfInterest.DoesNotExist:
            return None
        return poi

    @strawberry.field
    def points_of_interest(
        self,
        info: strawberry.types.Info,
        token: Optional[str] = strawberry.UNSET,
        order_by: Optional[List[Optional[str]]] = strawberry.UNSET,
    ) -> Optional[List[PointOfInterestNode]]:

        order = [] if order_by is strawberry.UNSET else order_by
        if token is strawberry.UNSET or token is None:
            return []

        return PointOfInterest.objects.filter(token=token).order_by(*order)

    @strawberry.field
    def reports_near_poi(
        self,
        info: strawberry.types.Info,
        after: float,
        token: Optional[str] = strawberry.UNSET,
    ) -> Optional[List[ReportGroupNode]]:

        if token is strawberry.UNSET or token is None:
            return []

        pois = PointOfInterest.objects.filter(token=token)
        if pois:
            radius = settings.REPORTS_NEAR_POI_RADIUS_M
            after = datetime.fromtimestamp(after)
            reports_ids = []
            for poi in pois:
                reports_ids.extend(Report.find_by_center(
                    latitude=poi.latitude,
                    longitude=poi.longitude,
                    after=after,
                    radius=radius).values_list('id', flat=True))
            reports = Report.objects\
                .filter(
                    pk__in=reports_ids,
                    reporter__isnull=False)\
                .distinct()\
                .annotate(snapped=SnapToGrid('location', settings.GRID_SIZE))\
                .annotate(center=Centroid(Collect('location')))\
                .annotate(count=Count('location'))
            return ReportGroupList().create_from(reports)
        return []


@strawberry.type
class PointOfInterestOutput(MutationOutput):
    """
    Returns point of interest (if created) with success/errors
    """
    point_of_interest: Optional[PointOfInterestNode]


@strawberry.type
class PointOfInterestMutation:
    """
    Point of Interest Mutation definition
    """

    @strawberry.mutation(extensions=[CheckCognitoUserMutationExtension()])
    def create_point_of_interest(
        self,
        token: str,
        arn: str,
        latitude: Decimal,
        longitude: Decimal,
        address: str,
    ) -> PointOfInterestOutput:

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except Exception as e:
            logger.error(f'Invalid longitude/latitude for POI: {e}')
            return PointOfInterestOutput(
                point_of_interest=None,
                success=False,
                errors=Messages.INVALID_LOCATION)

        location = Point((longitude, latitude), srid=settings.SRID)

        if os.environ.get('BUILD_ENV', None) != 'local':
            geocoder = GoogleV3(api_key=settings.GOOGLE_MAPS_API_KEY)
            address = geocoder.reverse((latitude, longitude)).address

        poi = PointOfInterest.objects.create(
            token=token,
            arn=arn,
            location=location,
            address=address)

        poi.save()
        return PointOfInterestOutput(
            point_of_interest=poi,
            success=True,
            errors=None)

    @strawberry.mutation(extensions=[CheckCognitoUserMutationExtension()])
    def update_point_of_interest(
        self,
        pk: int,
        token: str,
        latitude: Decimal,
        longitude: Decimal,
        address: str
    ) -> PointOfInterestOutput:

        try:
            poi = PointOfInterest.objects.get(pk=pk, token=token)
        except PointOfInterest.DoesNotExist:
            return PointOfInterestOutput(
                point_of_interest=None,
                success=False,
                errors=Messages.POI_NOT_FOUND)

        instance_modified = False
        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except Exception as e:
            logger.error(f'Invalid longitude/latitude for POI: {e}')
            return PointOfInterestOutput(
                point_of_interest=None,
                success=False,
                errors=Messages.INVALID_LOCATION)

        location = Point((longitude, latitude), srid=settings.SRID)
        if poi.location != location:
            poi.location = location
            if os.environ.get('BUILD_ENV', None) == 'local':
                poi.address = address
            else:
                geocoder = GoogleV3(api_key=settings.GOOGLE_MAPS_API_KEY)
                address = geocoder.reverse((latitude, longitude))
                poi.address = address.address
            instance_modified = True

        if instance_modified:
            poi.save()

        return PointOfInterestOutput(
            point_of_interest=poi,
            success=True,
            errors=None)

    @strawberry.mutation(extensions=[CheckCognitoUserMutationExtension()])
    def delete_point_of_interest(
        self,
        pk: int,
        token: str
    ) -> MutationOutput:

        try:
            PointOfInterest.objects.get(pk=pk, token=token).delete()
        except PointOfInterest.DoesNotExist:
            return MutationOutput(
                success=False,
                errors=Messages.POI_NOT_FOUND)

        return MutationOutput(
            success=True,
            errors=None)
