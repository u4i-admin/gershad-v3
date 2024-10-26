from django.urls import re_path

from static_page import views


urlpatterns = [
    re_path(r'staticpage', views.StaticPageView.as_view(), name='static-page-view'),
    re_path(r'userguide', views.UserGuideList.as_view(), name='user-guide-view'),
    re_path(r'kyrs', views.KnowYourRightsList.as_view(), name='kyr-chapters-view'),
    re_path(r'bestpractices', views.BestPracticesList.as_view(), name='best-practices-view'),
]
