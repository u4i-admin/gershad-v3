from django.db.models import Count, Q
from django.contrib import admin, messages
from leaflet.admin import LeafletGeoAdminMixin

from prediction.models import (
    ClusterGroup,
    HotZoneCluster,
    TrainingData,
    DBSCANModel
)


class ClusterGroupAdmin(LeafletGeoAdminMixin, admin.ModelAdmin):
    list_display = (
        'centroid',
        'total_reports',
        'trained_model',
        'created',
    )

    list_filter = (
        'trained_model__training_data',
        'trained_model__period',
    )

    fields = (
        'centroid_location',
        'trained_model',
        'created',
        'reports',
        'total_reports',
        'count_per_type',
    )

    readonly_fields = (
        'centroid_location',
        'trained_model',
        'created',
        'reports',
        'total_reports',
        'count_per_type',
    )

    @admin.display
    def centroid(self, obj):
        return f'({obj.centroid_location.x}, {obj.centroid_location.y})'

    def has_add_permission(self, request):
        return False

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(
            _reports_count=Count("reports", distinct=True),
        )
        return queryset

    def total_reports(self, obj):
        return obj._reports_count

    total_reports.admin_order_field = "_reports_count"

    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        group = ClusterGroup.objects.get(pk=object_id)
        centroid = group.centroid_location
        reports_locations = group.reports.values_list('location', flat=True)
        extra_context['reports_locations'] = [[location.y, location.x] for location in reports_locations if location != centroid]
        hotzones_locations = HotZoneCluster.objects.filter(
            Q(is_active=True) | Q(is_manual=True)).values_list('centroid_location', 'name')
        extra_context['hotzones_locations'] = [[location[0].y, location[0].x] for location in hotzones_locations]
        extra_context['hotzones_names'] = [str(location[1]) for location in hotzones_locations]
        extra_context['longitude'] = centroid.x
        extra_context['latitude'] = centroid.y
        return super().change_view(
            request,
            object_id,
            form_url,
            extra_context=extra_context,
        )


class HotZoneClusterAdmin(LeafletGeoAdminMixin, admin.ModelAdmin):
    list_display = (
        'name',
        'centroid',
        'period',
        'total_reports',
        'hotzone_level',
        'is_active',
        'is_manual',
        'created',
    )

    list_filter = (
        'hotzone_level',
        'is_active',
        'is_manual',
        'period',
    )

    list_editable = (
        'is_manual',
    )

    fields = (
        'name',
        'centroid_location',
        'period',
        'created',
        'reports',
        'total_reports',
        'count_per_type',
        'hotzone_level',
        'is_manual',
    )

    readonly_fields = (
        'period',
        'created',
        'reports',
        'total_reports',
        'count_per_type',
    )

    @admin.display
    def centroid(self, obj):
        return f'({obj.centroid_location.x}, {obj.centroid_location.y})'

    def has_add_permission(self, request):
        return True

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(
            _reports_count=Count("reports", distinct=True),
        )
        return queryset

    def total_reports(self, obj):
        return obj._reports_count

    total_reports.admin_order_field = "_reports_count"

    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        hotzone = HotZoneCluster.objects.get(pk=object_id)
        centroid = hotzone.centroid_location
        reports_locations = hotzone.reports.values_list('location', flat=True)
        extra_context['reports_locations'] = [[location.y, location.x] for location in reports_locations if location != centroid]
        extra_context['longitude'] = centroid.x
        extra_context['latitude'] = centroid.y
        return super().change_view(
            request,
            object_id,
            form_url,
            extra_context=extra_context,
        )


class TrainingDataAdmin(LeafletGeoAdminMixin, admin.ModelAdmin):
    list_display = (
        'training_days',
        'eps',
        'min_samples',
        'min_cluster_reports',
        'outliers_included',
        'clusters_by_period',
    )

    fields = (
        'training_days',
        'eps',
        'min_samples',
        'min_cluster_reports',
        'outliers_included',
        'clusters_by_period',
        'starting_weekday',
        'starting_time',
        'period_interval',
        'period_overlap_start',
        'period_overlap_end',
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def save_model(self, request, obj, form, change):
        messages.add_message(request, messages.WARNING, 'This may take a while... The results should be available soon.')
        DBSCANModel.objects.all().delete()
        # Trigger training the model next time the cronjob runs
        obj.run_next_cron = True
        super().save_model(request, obj, form, change)


class DBSCANModelAdmin(admin.ModelAdmin):
    list_display = (
        'training_data',
        'period',
        'total_clusters',
        'homogeneity_score',
        'completeness_score',
        'v_measure_score',
        'adjusted_rand_score',
        'adjusted_mutual_info_score',
        'silhouette_score',
    )

    list_filter = (
        'training_data',
    )

    fields = (
        'training_data',
        'period',
        'total_clusters',
        'eps',
        'min_samples',
        'metric',
        'metric_params',
        'algorithm',
        'leaf_size',
        'p',
        'n_jobs',
        'homogeneity_score',
        'completeness_score',
        'v_measure_score',
        'adjusted_rand_score',
        'adjusted_mutual_info_score',
        'silhouette_score',
    )

    readonly_fields = (
        'training_data',
        'period',
        'total_clusters',
        'eps',
        'min_samples',
        'metric',
        'metric_params',
        'algorithm',
        'leaf_size',
        'p',
        'n_jobs',
        'homogeneity_score',
        'completeness_score',
        'v_measure_score',
        'adjusted_rand_score',
        'adjusted_mutual_info_score',
        'silhouette_score',
    )

    def has_add_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(
            _clusters_count=Count("cluster_groups", distinct=True),
        )
        return queryset

    def total_clusters(self, obj):
        return obj._clusters_count

    total_clusters.admin_order_field = "_clusters_count"

    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        model = DBSCANModel.objects.get(pk=object_id)
        centroids = model.cluster_groups.values_list('centroid_location', flat=True)
        extra_context['centroids'] = [[location.y, location.x] for location in centroids]
        return super().change_view(
            request,
            object_id,
            form_url,
            extra_context=extra_context,
        )


admin.site.register(ClusterGroup, ClusterGroupAdmin)
admin.site.register(HotZoneCluster, HotZoneClusterAdmin)
admin.site.register(DBSCANModel, DBSCANModelAdmin)
admin.site.register(TrainingData, TrainingDataAdmin)
