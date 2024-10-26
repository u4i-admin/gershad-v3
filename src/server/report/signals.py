import json

from django.dispatch import receiver
from django.db.models.signals import post_save

from report.models import Report
from poi.models import PointOfInterest
from main.sns import publish_sns_notification


@receiver(post_save, sender=Report)
def report_created(sender, instance, created, **kwargs):
    if created:
        location = instance.location
        pois = PointOfInterest.find_by_center_point(location)
        for poi in pois:
            info = {
                'latitude': instance.latitude,
                'longitude': instance.longitude,
                'address': instance.address,
                'type': instance.type.name,
            }
            message = json.dumps(info)
            subject = instance.type.name
            attribute = {
                'report_latitude': {
                    'DataType': 'Number',
                    'StringValue': str(instance.latitude),
                },
                'report_longitude': {
                    'DataType': 'Number',
                    'StringValue': str(instance.longitude),
                },
                'report_address': {
                    'DataType': 'String',
                    'StringValue': instance.address,
                },
                'report_type': {
                    'DataType': 'String',
                    'StringValue': instance.type.name
                }
            }
            publish_sns_notification(poi.arn, message, subject, attribute)
