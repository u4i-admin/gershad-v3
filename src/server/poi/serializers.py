import os
from django.contrib.gis.geos import Point
from django.conf import settings

from rest_framework import serializers

from poi.models import PointOfInterest

from geopy.geocoders import GoogleV3


class PointOfInterestSerializer(serializers.Serializer):
    """
    Serialzier for Point of Interest
    """
    id = serializers.IntegerField(
        read_only=True)
    token = serializers.CharField()
    address = serializers.CharField(required=False)
    arn = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    created = serializers.DateTimeField(read_only=True)
    request_time = serializers.DateTimeField(source="requested", required=False)

    def update(self, instance, validated_data):

        instance_modified = False
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
                instance.address = validated_data.pop('address')
            else:
                geocoder = GoogleV3(api_key=settings.GOOGLE_MAPS_API_KEY)
                address = geocoder.reverse((latitude, longitude))
                instance.address = address.address
            instance_modified = True

        if instance_modified:
            instance.save()

        return instance

    def create(self, validated_data):

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

        created = PointOfInterest.objects.create(**validated_data)

        return created
