import datetime
import logging

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics, views
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework import status

from report.report_group import ReportGroupList
from main.permissions import GershadAPIPermission, GershadAPIAdminPermission
from main.utils import redact_data
from report.models import Report, Reporter
from report.serializers import (
    ReportSerializer,
    ReportGroupSerializer)


logger = logging.getLogger()


def get_params(request):
    latitude = request.GET.get('latitude', None)
    longitude = request.GET.get('longitude', None)
    if None in [latitude, longitude]:
        east = request.GET.get('east', None)
        west = request.GET.get('west', None)
        south = request.GET.get('south', None)
        north = request.GET.get('north', None)
        if None in [east, west, south, north]:
            logger.error(f'ReportView is called with wrong GET parameters')
            raise APIException(
                detail={
                    'detail': 'latitude, longitude OR west, south, east, north not met for actual request parameters',
                    'title': 'Bad Request',
                    'status': 400,
                })
        try:
            east = float(east)
            west = float(west)
            north = float(north)
            south = float(south)
        except Exception as exc:
            logger.error(f'ReportView parameters are invalid')
            raise APIException(
                detail={
                    'detail': f'west, south, east, north should be decimal numbers ({exc})',
                    'title': 'Bad Request',
                    'status': 400,
                })
        return (east, west, north, south)
    else:
        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except Exception as exc:
            logger.error(f'ReportView parameters are invalid')
            raise APIException(
                detail={
                    'detail': f'latitude, longitude should be decimal numbers ({exc})',
                    'title': 'Bad Request',
                    'status': 400,
                })
        return (latitude, longitude)


class ReportDelete(views.APIView):
    """
    View to delete Report
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [GershadAPIPermission]

    def post(self, request, *args, **kwargs):
        pk = request.data.get('id', None)
        if not request.data.get('token'):
            if request.auth:
                token = request.auth
        else:
            token = request.data.get('token', None)

        try:
            Report.objects.get(pk=pk, reporter__token=token).delete()
        except Report.DoesNotExist:
            logger.error(f'Unable to find report {pk} {token}')
            pass

        return Response(status=status.HTTP_200_OK)


class PermanentReportList(generics.ListAPIView):
    """
    View for permanent Reports
    """
    queryset = Report.objects.all()
    permission_classes = [GershadAPIAdminPermission]

    def get(self, request, format=None):
        reports = Report.find_and_cluster(permanent=True)

        report_group = ReportGroupList().create_from(reports)
        serializer = ReportGroupSerializer(report_group, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        if not request.data.get('token'):
            if request.auth:
                request.data['token'] = str(request.auth)

        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        data = redact_data(request.data)
        logger.error(f'ReportPermanent is called with wrong POST parameters: {data}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        if not request.data.get('token'):
            if request.auth:
                request.data['token'] = str(request.auth)
        token = request.data.get('token', None)
        pk = request.data.get('id', None)
        if token is None or pk is None:
            return Response(f'Invalid token or ID (Token={token} and ID={pk})', status.HTTP_401_UNAUTHORIZED)
        try:
            report = Report.objects.get(pk=pk, reporter__token=token)
        except Report.DoesNotExist:
            return Response(f'Unable to find report', status.HTTP_404_NOT_FOUND)

        serializer = ReportSerializer(report, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        data = redact_data(request.data)
        logger.error(f'ReportPermanent is called with wrong PUT parameters: {data}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReportView(views.APIView):
    """
    View to Create and View Report
    """
    queryset = Report.objects.all()
    permission_classes = [GershadAPIPermission]

    def get(self, request, id, format=None):
        report = get_object_or_404(Report, pk=id)

        report.token = report.reporter.token
        report.client = report.reporter.client

        serializer = ReportSerializer(report)
        return Response(serializer.data)


class ReportList(generics.ListAPIView):
    """
    View to List reports
    """
    queryset = Report.objects.all()
    permission_classes = [GershadAPIPermission]

    def get(self, request, format=None):
        params = get_params(request)
        if len(params) == 4:
            reports = Report.find_by_box_and_cluster(*params)
        elif len(params) == 2 or len(params) == 3:
            reports = Report.find_by_center_and_cluster(*params)
        else:
            return []

        report_group = ReportGroupList().create_from(reports)
        serializer = ReportGroupSerializer(report_group, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        if not request.data.get('token'):
            if request.auth:
                request.data['token'] = str(request.auth)

        token = request.data['token']
        if token:
            all_reports = Report.objects.filter(reporter__token=token)
            latest = all_reports.latest('created') if all_reports.count() > 0 else None
            if (latest and latest.created > timezone.now() - timezone.timedelta(minutes=settings.REPORT_INTERVAL_LIMIT_MIN)):
                return Response('Too many reports', status=status.HTTP_429_TOO_MANY_REQUESTS)

        request.data.pop('permanent', None)
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        data = redact_data(request.data)

        logger.error(f'ReportView is called with wrong POST parameters: {data}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        if not request.data.get('token'):
            if request.auth:
                request.data['token'] = str(request.auth)
        token = request.data.get('token', None)
        pk = request.data.get('id', None)
        if token is None or pk is None:
            return Response(f'Invalid token or ID (Token={token} and ID={pk})', status.HTTP_401_UNAUTHORIZED)
        try:
            report = Report.objects.get(pk=pk, reporter__token=token)
        except Report.DoesNotExist:
            return Response(f'Unable to find report', status.HTTP_404_NOT_FOUND)

        request.data.pop('permanent', None)
        serializer = ReportSerializer(report, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        data = redact_data(request.data)
        logger.error(f'ReportView is called with wrong PUT parameters: {data}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonitoringView(views.APIView):
    """
    Total new reports/reportes per day
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):

        day = request.GET.get('day', None)
        hour = request.GET.get('hour', None)

        if day:
            start_date = datetime.datetime.strptime(day, '%Y-%m-%d')
            end_date = start_date + datetime.timedelta(days=1)
        elif hour:
            start_date = datetime.datetime.strptime(hour, '%Y-%m-%d-%H:%M')
            end_date = start_date + datetime.timedelta(hours=1)
        else:
            return JsonResponse({
                'reports': 0,
                'reporters': 0
            }, safe=False)

        reports_count = Report.objects.filter(
            created__range=(start_date, end_date)).count()
        reporters_count = Reporter.objects.filter(
            created__range=(start_date, end_date)).count()

        return JsonResponse({
            'reports': reports_count,
            'reporters': reporters_count
        }, safe=False)
