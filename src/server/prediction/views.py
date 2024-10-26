from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponseRedirect
from django.urls import reverse

from prediction.models import ClusterGroup, HotZoneCluster


@staff_member_required
def create_hotzone_from_cluster(request, cluster_id):
    """
        Creates hot zone from ClusterGroup admin change form.

        By default the hot zone will be inactive. Admins will be redirected
        to the hot zone change form where they can correct centroid location
        and activate the hotzone.
    """

    url_name = 'admin:{}_{}_change'.format('prediction', 'hotzonecluster')

    cluster_group = ClusterGroup.objects.get(pk=cluster_id)

    hotzone, created = HotZoneCluster.objects.get_or_create(
        centroid_location=cluster_group.centroid_location,
        period=cluster_group.trained_model.period
    )

    hotzone.reports.set(cluster_group.reports.all())
    hotzone.is_manual = False
    hotzone.save()

    url = reverse(url_name, args=[hotzone.pk])

    return HttpResponseRedirect(url)
