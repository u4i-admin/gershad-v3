from django.urls import path

from prediction.views import create_hotzone_from_cluster


urlpatterns = [
    path('create/<int:cluster_id>/', create_hotzone_from_cluster, name='create-hotzone'),
]
