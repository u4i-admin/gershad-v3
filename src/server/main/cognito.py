import boto3
import logging

from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger()


def check_cognito_user(token):

    value = cache.get(token)
    if value is not None:
        return value

    client = None
    if settings.BUILD_ENV == 'local':
        if None not in [settings.AWS_COGNITO_ACCESS_KEY, settings.AWS_COGNITO_SECRET_KEY]:
            client = boto3.client(
                'cognito-identity',
                settings.COGNITO_POOL_REGION,
                aws_access_key_id=settings.AWS_COGNITO_ACCESS_KEY,
                aws_secret_access_key=settings.AWS_COGNITO_SECRET_KEY)
    else:
        client = boto3.client(
            'cognito-identity',
            settings.COGNITO_POOL_REGION)

    if client is None:
        logger.info('Skipping permissions checking...No client')
        return True

    try:
        client.describe_identity(IdentityId=token)
    except client.exceptions.ResourceNotFoundException:
        cache.set(token, False, settings.COGNITO_MISS_CACHE_TIMEOUT)
        logger.warning(f'User not found {token}')
        return False

    cache.set(token, True, settings.COGNITO_EXIST_CACHE_TIMEOUT)
    return True
