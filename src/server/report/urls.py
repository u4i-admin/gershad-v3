from django.urls import re_path

from report import views


urlpatterns = [
    re_path(r'reports/delete', views.ReportDelete.as_view(), name='report-delete'),
    re_path(r'reports/permanent', views.PermanentReportList.as_view(), name='report-permanent'),
    re_path(r'reports/(?P<id>.+)$', views.ReportView.as_view(), name='report-retrieve'),
    re_path(r'reports', views.ReportList.as_view(), name='report-view'),
    re_path(r'monitoring', views.MonitoringView.as_view(), name='monitoring-view'),
]
