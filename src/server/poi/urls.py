from django.urls import re_path

from poi import views


urlpatterns = [
    re_path(r'poi/delete', views.PointOfInterestDelete.as_view(), name='poi-delete'),
    re_path(r'poi/(?P<id>.+)$', views.PointOfInterestView.as_view(), name='poi-retrieve'),
    re_path(r'poi', views.PointOfInterestList.as_view(), name='poi-view'),
]
