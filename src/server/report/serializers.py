import os
from django.contrib.gis.geos import Point
from django.conf import settings

from rest_framework import serializers
from rest_framework.exceptions import APIException

from main.utils import update_data_if_changed
from report.models import Report, ReportType, Reporter

from geopy.geocoders import GoogleV3


class NotAcceptable(APIException):
    """
    Custom Error to represent Unacceptable API calls
    """
    status_code = 406
    default_detail = 'Not Acceptable, try again later.'
    default_code = 'not_acceptable'


class ReportSerializer(serializers.Serializer):
    """
    Serializer for Report
    """

    id = serializers.IntegerField(
        read_only=True)
    modified = serializers.DateTimeField(
        read_only=True)
    address = serializers.CharField(required=False)
    description = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True)
    type = serializers.CharField()
    token = serializers.CharField()
    client = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    verified = serializers.BooleanField(required=False)
    permanent = serializers.BooleanField(required=False)
    request_time = serializers.DateTimeField(source="requested", required=False)

    def update(self, instance, validated_data):

        instance_modified = False
        type_txt = validated_data.pop('type')
        try:
            type = ReportType.objects.get(name=type_txt)
        except ReportType.DoesNotExist:
            raise serializers.ValidationError(f'Unknown Report Type {type_txt}')
        if instance.type != type:
            instance.type = type
            instance_modified = True

        latitude = validated_data.pop('latitude')
        longitude = validated_data.pop('longitude')
        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except Exception as exc:
            raise serializers.ValidationError(f'Invalid latitude, longitude value {exc}')
        location = Point((longitude, latitude), srid=settings.SRID)
        if instance.location != location:
            instance.location = location
            if os.environ.get('BUILD_ENV', None) == 'local':
                instance_modified |= update_data_if_changed(validated_data, instance, 'address')
            else:
                geocoder = GoogleV3(api_key=settings.GOOGLE_MAPS_API_KEY)
                address = geocoder.reverse((latitude, longitude))
                instance.address = address.address
            instance_modified = True

        if 'description' in validated_data:
            instance_modified |= update_data_if_changed(validated_data, instance, 'description')
        else:
            instance.description = None
            instance.save()
        instance_modified |= update_data_if_changed(validated_data, instance, 'verified')
        instance_modified |= update_data_if_changed(validated_data, instance, 'permanent')

        token = validated_data.pop('token')
        client = validated_data.pop('client')

        if instance_modified:
            instance.save()

        instance.token = token
        instance.client = client

        return instance

    def create(self, validated_data):

        type_txt = validated_data.pop('type')
        try:
            type = ReportType.objects.get(name=type_txt)
        except ReportType.DoesNotExist:
            raise serializers.ValidationError(f'Unknown Report Type {type_txt}')
        validated_data['type'] = type

        latitude = validated_data.pop('latitude')
        longitude = validated_data.pop('longitude')
        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except Exception as exc:
            raise serializers.ValidationError(f'Invalid latitude, longitude value {exc}')
        location = Point((longitude, latitude), srid=settings.SRID)
        validated_data['location'] = location

        if os.environ.get('BUILD_ENV', None) != 'local':
            geocoder = GoogleV3(api_key=settings.GOOGLE_MAPS_API_KEY)
            address = geocoder.reverse((latitude, longitude))
            validated_data['address'] = address.address

        token = validated_data.pop('token')
        client = validated_data.pop('client')
        reporter, _ = Reporter.objects.get_or_create(
            token=token,
            client=client
        )
        validated_data['reporter'] = reporter

        created = Report.objects.create(**validated_data)
        created.token = token
        created.client = client

        return created


class ReportGroupSerializer(serializers.Serializer):
    """
    Serializer for Report Groups
    """

    lastUpdate = serializers.DateTimeField(read_only=True)
    centroidLatitude = serializers.FloatField(read_only=True)
    centroidLongitude = serializers.FloatField(read_only=True)
    verified = serializers.BooleanField(read_only=True)
    faded = serializers.FloatField(read_only=True)
    score = serializers.FloatField(read_only=True)
    type = serializers.CharField(read_only=True)
    permanent = serializers.BooleanField(read_only=True)
    reportCount = serializers.IntegerField(read_only=True)
    reports = ReportSerializer(many=True)
    request_time = serializers.DateTimeField(source="requested", read_only=True)
