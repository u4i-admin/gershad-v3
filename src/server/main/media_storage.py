from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


def get_s3_url():
    s3_url = None

    if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN'):
        s3_url = 'https://{s3_domain}'.format(
            s3_domain=settings.AWS_S3_CUSTOM_DOMAIN
        )

    return s3_url


class MediaStorage(S3Boto3Storage):
    location = settings.MEDIAFILES_LOCATION
    file_overwrite = False


class StaticStorage(S3Boto3Storage):
    location = settings.STATICFILES_LOCATION
    file_overwrite = False
