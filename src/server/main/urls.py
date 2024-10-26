from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns
from django.views.decorators.csrf import csrf_exempt

from strawberry.django.views import GraphQLView

from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail import urls as wagtail_urls
from wagtail_footnotes import urls as footnotes_urls

from main.schema import schema


urlpatterns = [
    path('admin/', admin.site.urls),
    path('cms/', include(wagtailadmin_urls)),
    path('documents/', include(wagtaildocs_urls)),
    path('api/external/v1', include('report.urls')),
    path('api/external/v1', include('poi.urls')),
    path('api/external/v1', include('static_page.urls')),
    path('hotzone/', include('prediction.urls')),
    path('graphql/', csrf_exempt(GraphQLView.as_view(schema=schema, graphiql=settings.DEBUG))),
    path('footnotes/', include(footnotes_urls)),

]

urlpatterns += i18n_patterns(
    path('', include(wagtail_urls)),
)
