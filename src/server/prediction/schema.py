import strawberry
import strawberry_django
from typing import Optional, List

from django.db.models import Q

from main.utils import Connection
from prediction.models import HotZoneCluster

from report.schema import PointFieldType


@strawberry.type
class ReportsTypeCount:
    """
    Reports count per type in a cluster
    """

    @strawberry.field
    def report_type(self) -> str:
        return self['report_type']

    @strawberry.field
    def reports_count(self) -> int:
        return self['reports_count']


@strawberry_django.type(
    HotZoneCluster, pagination=True)
class HotZoneClustertNode(strawberry.relay.Node):
    """
    Relay: HotZoneCluster of Interest Node
    """
    pk: int
    centroid_location: PointFieldType
    hotzone_level: int

    @classmethod
    def get_queryset(cls, queryset, info, **kwargs):
        return queryset.filter(is_active=True)

    @strawberry.field
    def count_per_type(
            self, info) -> Optional[List[Optional[ReportsTypeCount]]]:
        types_count = []
        for report_type, reports_count in self.count_per_type.items():
            types_count.append(
                {
                    'report_type': report_type,
                    'reports_count': reports_count
                }
            )
        return types_count

    @strawberry.field
    def total_reports_count(self) -> int:
        return self.reports.count()


@strawberry.type
class HotZoneClusterQuery:
    """
    Hot Zone Query definition
    """

    @strawberry.field
    def hotzones(
        self,
        info: strawberry.types.Info,
        before: Optional[str] = None,
        after: Optional[str] = None,
        first: Optional[int] = None,
        last: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Optional[Connection[HotZoneClustertNode]]:

        # We should return all active Hotzones and all permanent(is_manual) Hotzones
        # Permanent(is_manual) Hotzones are returned even if inactive
        hotzones = HotZoneCluster.objects.filter(
            Q(is_active=True) | Q(is_manual=True))

        return Connection[HotZoneClustertNode].resolve_connection(
            info=info,
            nodes=hotzones,
            offset=offset,
            first=first,
            last=last,
            after=after,
            before=before)
