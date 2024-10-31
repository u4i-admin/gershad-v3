from django.contrib import admin
from rangefilter.filters import DateRangeFilter

from leaflet.admin import LeafletGeoAdminMixin

from report.models import (
    ReportType,
    ClientType,
    Report,
    Reporter,
)


class ReportTypeAdmin(admin.ModelAdmin):
    list_display = (
        'name',)

    search_fields = (
        'name',)


class ReportAdmin(LeafletGeoAdminMixin, admin.ModelAdmin):
    list_display = (
        'address',
        'coordinates',
        'type',
        'permanent',
        'verified',
        'created',
        'requested',
        'modified',
    )

    list_filter = (
        'reporter__client',
        ('created', DateRangeFilter),
    )

    fields = (
        'address',
        'description',
        'type',
        'permanent',
        'verified',
        'deleted',
        'location',
        'latitude',
        'longitude',
        'reporter',
        'created',
        'requested',
        'modified'
    )

    readonly_fields = (
        'latitude',
        'longitude',
        'created',
        'modified'
    )

    change_form_template = 'admin/geosearch_change_form.html'

    def get_form(self, request, obj=None, **kwargs):
        form = super(ReportAdmin, self).get_form(request, obj, **kwargs)
        if not form.base_fields['reporter'].initial:
            if not request.user.reporter:
                reporter = Reporter.objects.create(
                    client=ClientType.ADMIN,
                    token=request.user.username
                )
                request.user.reporter = reporter
                request.user.save()
            form.base_fields['reporter'].initial = request.user.reporter
        return form


class ReporterAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'client')


admin.site.register(Report, ReportAdmin)
admin.site.register(Reporter, ReporterAdmin)
admin.site.register(ReportType, ReportTypeAdmin)
