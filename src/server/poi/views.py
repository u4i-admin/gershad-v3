import logging

from django.shortcuts import get_object_or_404

from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework import status

from poi.models import PointOfInterest
from poi.serializers import PointOfInterestSerializer
from main.permissions import GershadAPIPermission
from main.utils import redact_data

logger = logging.getLogger()


class PointOfInterestDelete(views.APIView):
    """
    View to delete Point of Interest
    """

    queryset = PointOfInterest.objects.all()
    serializer_class = PointOfInterestSerializer
    permission_classes = [GershadAPIPermission]

    def post(self, request, *args, **kwargs):
        if not request.data.get('token'):
            if request.auth:
                request.data['token'] = str(request.auth)
        pk = request.data.get('id', None)
        token = request.data.get('token', None)

        try:
            PointOfInterest.objects.get(pk=pk, token=token).delete()
        except PointOfInterest.DoesNotExist:
            logger.error(f'Unable to find point of interest {pk} {token}')
            pass

        return Response(status=status.HTTP_200_OK)


class PointOfInterestView(views.APIView):
    """
    View to Create and View Point of Interest
    """
    queryset = PointOfInterest.objects.all()
    permission_classes = [GershadAPIPermission]

    def get(self, request, id, format=None):
        poi = get_object_or_404(PointOfInterest, pk=id)

        serializer = PointOfInterestSerializer(poi)
        return Response(serializer.data)


class PointOfInterestList(generics.ListAPIView):
    """
    View to List Point of Interests
    """
    queryset = PointOfInterest.objects.all()
    permission_classes = [GershadAPIPermission]

    def get(self, request, format=None):
        if not request.data.get('token'):
            if request.auth:
                request.data['token'] = str(request.auth)
        token = request.GET.get('token', None)
        if token is None:
            return Response(status.HTTP_400_BAD_REQUEST)

        pois = PointOfInterest.objects.filter(token=token)
        serializer = PointOfInterestSerializer(pois, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        if not request.data.get('token'):
            if request.auth:
                request.data['token'] = str(request.auth)
        serializer = PointOfInterestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        data = redact_data(request.data)
        logger.error(f'PointOfInterestView is called with wrong POST parameters: {data}')
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
            poi = PointOfInterest.objects.get(pk=pk, token=token)
        except PointOfInterest.DoesNotExist:
            return Response(f'Unable to find point of interest', status.HTTP_404_NOT_FOUND)

        serializer = PointOfInterestSerializer(poi, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        data = redact_data(request.data)
        logger.error(f'PointOfInterestView is called with wrong PUT parameters: {data}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
