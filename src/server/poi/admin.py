from django.contrib import admin
from leaflet.admin import LeafletGeoAdminMixin

from poi.models import PointOfInterest


class PointOfInterestAdmin(LeafletGeoAdminMixin, admin.ModelAdmin):
    list_display = (
        'address',
        'coordinates',)

    fields = (
        'address',
        'location',
        'latitude',
        'longitude',
        'token',
        'arn',
        'created',
        'modified'
    )

    readonly_fields = (
        'latitude',
        'longitude',
        'created',
        'modified'
    )

    change_form_template = 'admin/geosearch_change_form.html'


admin.site.register(PointOfInterest, PointOfInterestAdmin)
