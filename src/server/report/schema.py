import os
import logging
import datetime

from django.conf import settings
from django.contrib.gis.geos import Point
from django.utils import timezone

from geopy.geocoders import GoogleV3

import strawberry
import strawberry_django

from decimal import Decimal
from typing import List, Optional, NewType

from main.permissions import CheckCognitoUserMutationExtension
from main.utils import MutationOutput, Messages

from report.models import (
    Report, Reporter, ReportType, ClientType)
from report.report_group import ReportGroupList


logger = logging.getLogger()


ClientTypeEnum = strawberry.enum(ClientType, name='ClientTypeEnum')


PointFieldType = strawberry.scalar(
    NewType("PointFieldType", object),
    description="""
    Type that represents report location,
    e.g.:
    {
        "x": 50.123456,
        "y": 30.123456
    }
    """,
    serialize=lambda v: {
        'x': v.x,
        'y': v.y
    },
    parse_value=lambda v: {
        'x': v.x,
        'y': v.y
    },
)


@strawberry_django.filters.filter(ReportType, lookups=True)
class ReportTypeFilter:
    name: strawberry.auto
    description: strawberry.auto


@strawberry_django.type(ReportType, pagination=True, filters=ReportTypeFilter)
class ReportTypeNode(strawberry.relay.Node):
    """
    Relay: Report Type Node
    """
    name: strawberry.auto
    description: strawberry.auto


@strawberry_django.type(Reporter, pagination=True)
class ReporterNode(strawberry.relay.Node):
    """
    Relay: Reporter Node
    """
    pk: int


@strawberry_django.filters.filter(Report, lookups=True)
class ReportFilter:
    type: strawberry.auto
    deleted: strawberry.auto
    verified: strawberry.auto
    permanent: strawberry.auto
    requested: strawberry.auto


@strawberry_django.type(Report, pagination=True, filters=ReportFilter)
class ReportNode(strawberry.relay.Node):
    """
    Relay: Report Node
    """
    pk: int
    address: strawberry.auto
    description: strawberry.auto
    verified: strawberry.auto
    permanent: strawberry.auto
    requested: strawberry.auto
    created: strawberry.auto
    modified: strawberry.auto
    location: PointFieldType
    type: ReportTypeNode
    reporter: Optional[ReporterNode]

    @strawberry.field
    def token(self, info, token: Optional[str] = None) -> str:
        report_token = ""
        if token and self.reporter.token == token:
            report_token = token
        return report_token

    @strawberry.field
    def client(self, info) -> str:
        return self.reporter.client


@strawberry.type
class ReportGroupNode:
    """
    Relay: Report Group Node
    """
    lastUpdate: str
    centroidLatitude: float
    centroidLongitude: float
    verified: bool
    faded: float
    score: float
    permanent: bool
    reportCount: int
    reports: Optional[List[ReportNode]]

    @strawberry.field
    def first_created(self, info) -> datetime.datetime:
        return min([report.created for report in self.reports])

    @strawberry.field
    def highest_pk(self, info) -> int:
        return max([report.pk for report in self.reports])


@strawberry.type
class ReportQuery:
    """
    Report Query definition
    """

    @strawberry.field
    def report(
        self,
        pk: int
    ) -> Optional[ReportNode]:
        report = None
        try:
            report = Report.objects.get(pk=pk)
        except Report.DoesNotExist:
            return None
        return report

    @strawberry.field
    def reports(
        self,
        info: strawberry.types.Info,
        token: Optional[str] = None,
        longitude: Optional[Decimal] = None,
        latitude: Optional[Decimal] = None,
        east: Optional[Decimal] = None,
        west: Optional[Decimal] = None,
        north: Optional[Decimal] = None,
        south: Optional[Decimal] = None,
        radius: Optional[int] = None,
    ) -> Optional[List[ReportGroupNode]]:

        if None in [latitude, longitude]:
            if None in [east, west, south, north]:
                return []
            try:
                east = float(east)
                west = float(west)
                north = float(north)
                south = float(south)
            except Exception as e:
                logger.error(f'Reports query is called with the wrong\
                              parameters {e}')
                return []
            params = (east, west, north, south)
        else:
            try:
                latitude = float(latitude)
                longitude = float(longitude)
            except Exception as e:
                logger.error(f'Reports query is called with the wrong\
                              parameters {e}')
                return []
            params = (latitude, longitude)

        if len(params) == 4:
            reports = Report.find_by_box_and_cluster(*params)
        elif len(params) == 2:
            reports = Report.find_by_center_and_cluster(
                latitude=latitude,
                longitude=longitude,
                radius=radius
            )
        else:
            return []

        if token:
            reports = [report for report in reports if report.reporter.token == token]

        return ReportGroupList().create_from(reports)


@strawberry.type
class ReportOutput(MutationOutput):
    """
    Returns point of interest (if created) with success/errors
    """
    report_groups: Optional[List[ReportGroupNode]]


@strawberry.type
class ReportMutation:
    """
    Report Mutation definition
    """

    @strawberry.mutation(extensions=[CheckCognitoUserMutationExtension()])
    def create_report(
        self,
        longitude: Decimal,
        latitude: Decimal,
        permanent: bool,
        report_type: str,
        address: str,
        token: str,
        client: ClientTypeEnum,
    ) -> ReportOutput:

        all_reports = Report.objects.filter(reporter__token=token)
        latest = all_reports.latest('created') if all_reports.count() > 0 else None
        if (latest and latest.created > timezone.now() - timezone.timedelta(
                minutes=settings.REPORT_INTERVAL_LIMIT_MIN)):
            return ReportOutput(
                report_groups=None,
                success=False,
                errors=Messages.TOO_MANY_REPORTS)

        try:
            type = ReportType.objects.get(name=report_type)
        except ReportType.DoesNotExist:
            return ReportOutput(
                report_groups=None,
                success=False,
                errors=Messages.UNKNOWN_REPORT_TYPE)

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except Exception as e:
            logger.error(f'Reports query is called with the wrong\
                          parameters {e}')
            return ReportOutput(
                report_groups=None,
                success=False,
                errors=Messages.INVALID_LOCATION)
        location = Point((longitude, latitude), srid=settings.SRID)

        if os.environ.get('BUILD_ENV', None) != 'local':
            geocoder = GoogleV3(api_key=settings.GOOGLE_MAPS_API_KEY)
            address = geocoder.reverse((latitude, longitude)).address
        reporter, _ = Reporter.objects.get_or_create(
            token=token,
            client=client
        )

        report = Report.objects.create(
            type=type,
            location=location,
            address=address,
            reporter=reporter,
            permanent=permanent)

        report.save()

        # Getting all the reports in the same location
        report_groups = Report.find_by_center_and_cluster(
            longitude=longitude,
            latitude=latitude)

        report_groups = ReportGroupList().create_from(report_groups)

        return ReportOutput(
            report_groups=report_groups,
            success=True,
            errors=None)

    @strawberry.mutation(extensions=[CheckCognitoUserMutationExtension()])
    def update_report(  # noqa C901
        self,
        pk: int,
        token: str,
        longitude: Decimal,
        latitude: Decimal,
        permanent: bool,
        verified: bool,
        report_type: str,
        address: str,
        description: Optional[str] = None,
    ) -> ReportOutput:

        try:
            report = Report.objects.get(pk=pk, reporter__token=token)
        except Report.DoesNotExist:
            return ReportOutput(
                report_groups=None,
                success=False,
                errors=Messages.REPORT_NOT_FOUND)

        instance_modified = False
        try:
            type = ReportType.objects.get(name=report_type)
        except ReportType.DoesNotExist:
            return ReportOutput(
                report_groups=None,
                success=False,
                errors=Messages.UNKNOWN_REPORT_TYPE)
        if report.type != type:
            report.type = type
            instance_modified = True

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except Exception as e:
            logger.error(f'Reports query is called with the wrong\
                          parameters {e}')
            return ReportOutput(
                report_groups=None,
                success=False,
                errors=Messages.INVALID_LOCATION)
        location = Point((longitude, latitude), srid=settings.SRID)
        if report.location != location:
            report.location = location
            if os.environ.get('BUILD_ENV', None) == 'local':
                instance_modified |= (report.address == address)
                report.address = address
            else:
                geocoder = GoogleV3(api_key=settings.GOOGLE_MAPS_API_KEY)
                address = geocoder.reverse((latitude, longitude))
                report.address = address.address
            instance_modified = True

        if description:
            instance_modified |= (report.description == description)
        else:
            report.description = None
            report.save()

        instance_modified |= (report.verified == verified)
        instance_modified |= (report.permanent == permanent)

        if instance_modified:
            report.description = description
            report.verified = verified
            report.permanent = permanent
            report.save()

        # Getting all the reports in the same location
        report_groups = Report.find_by_center_and_cluster(
            longitude=longitude,
            latitude=latitude)

        report_groups = ReportGroupList().create_from(report_groups)

        return ReportOutput(
            report_groups=report_groups,
            success=True,
            errors=None)

    @strawberry.mutation(extensions=[CheckCognitoUserMutationExtension()])
    def delete_report(
        self,
        pk: int,
        token: str
    ) -> MutationOutput:
        try:
            Report.objects.get(pk=pk, reporter__token=token).delete()
        except Report.DoesNotExist:
            return MutationOutput(
                success=False,
                errors=Messages.POI_NOT_FOUND)

        return MutationOutput(
            success=True,
            errors=None)
