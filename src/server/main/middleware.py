import os
from django.conf import settings
from django.utils.cache import patch_cache_control


class RevisionMiddleware:
    """
    Added code version to the response
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        revision = '{}b{}-{}'.format(
            str(settings.VERSION_NUM),
            str(settings.BUILD_NUM),
            str(settings.GIT_SHORT_SHA))
        response['X-Source-Revision'] = revision

        return response


class ResponseAndViewManipulationMiddleware:
    """
    Middleware that runs before Django calls view.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.s3_url = None

        if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN'):
            self.s3_url = 'https://{s3_domain}'.format(
                s3_domain=settings.AWS_S3_CUSTOM_DOMAIN
            ).encode()

    def __call__(self, request):

        response = self.get_response(request)
        if (response.status_code < 300):
            if (hasattr(request, 'resolver_match') and
                    hasattr(request.resolver_match, 'namespaces') and
                    isinstance(request.resolver_match.namespaces, list) and
                    'api' in request.resolver_match.namespaces):
                patch_cache_control(
                    response,
                    max_age=0,
                    s_maxage=315360000,
                    public=True,
                )

            if (os.environ.get('BUILD_ENV', None) != 'local' and
                    hasattr(settings, 'AWS_CLOUDFRONT_DISTRIBUTION_ID') and
                    isinstance(settings.AWS_CLOUDFRONT_DISTRIBUTION_ID, str) and
                    len(settings.AWS_CLOUDFRONT_DISTRIBUTION_ID) > 0 and
                    self.s3_url):
                response.content = response.content.replace(
                    self.s3_url,
                    b''
                )

        return response
