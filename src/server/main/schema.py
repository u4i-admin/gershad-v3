from django.conf import settings

import strawberry
from strawberry_django.optimizer import DjangoOptimizerExtension
from strawberry.extensions import AddValidationRules
from graphql.validation import NoSchemaIntrospectionCustomRule

from report.schema import ReportQuery, ReportMutation
from poi.schema import PointOfInterestQuery, PointOfInterestMutation
from prediction.schema import HotZoneClusterQuery
from static_page.schema import StaticPageQuery


@strawberry.type
class Query(
        ReportQuery,
        PointOfInterestQuery,
        HotZoneClusterQuery,
        StaticPageQuery):
    pass


@strawberry.type
class Mutation(
        ReportMutation,
        PointOfInterestMutation):
    pass


extensions = [
    DjangoOptimizerExtension,
]

# Disable Introspection in production
if settings.BUILD_ENV == 'production':
    extensions.append(AddValidationRules([NoSchemaIntrospectionCustomRule]))

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=extensions)
