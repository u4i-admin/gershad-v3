import boto3
import logging

from django.conf import settings

logger = logging.getLogger()


def publish_sns_notification(arn, message, subject=None, attribute=None):

    client = None
    if settings.BUILD_ENV == 'local':
        if None not in [settings.AWS_SNS_ACCESS_KEY, settings.AWS_SNS_SECRET_KEY]:
            client = boto3.client(
                'sns',
                aws_access_key_id=settings.AWS_SNS_ACCESS_KEY,
                aws_secret_access_key=settings.AWS_SNS_SECRET_KEY)
    else:
        client = boto3.client('sns', region_name=settings.AWS_SNS_REGION)

    if client is None:
        logger.info('Skipping permissions checking...No client')
        logger.info(f'SNS: ARN={arn} MSG={message} SUB={subject} ATT={attribute}')
        return True

    try:
        client.publish(
            TargetArn=arn,
            Message=message,
            Subject=subject,
            MessageAttributes=attribute)
    except Exception as exc:
        logger.error(f'Error in publishing SNS to {arn} ({exc})')
        logger.info(f'SNS: ARN={arn} MSG={message} SUB={subject} ATT={attribute}')
        return
