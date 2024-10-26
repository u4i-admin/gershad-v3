import urllib
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import redirect

from wagtail_headless_preview.models import HeadlessPreviewMixin


class PreviewMixin(HeadlessPreviewMixin):
    def get_client_root_url(self):
        kyrs = ContentType.objects.get(model='knowyourrightspage').id
        best_practices = ContentType.objects.get(model='bestpracticespage').id
        if self.content_type_id == kyrs:
            slug = 'know-your-rights.html'
        elif self.content_type_id == best_practices:
            slug = 'best-practice.html'
        else:
            slug = 'index.html'
        return f'{settings.FRONT_WEB_URL}/{slug}'

    def get_preview_url(self, token):
        token_param = urllib.parse.urlencode({"previewToken": token})
        return self.get_client_root_url() + "?" + token_param

    def serve(self, request):
        if settings.BUILD_ENV == 'local':
            site_id, site_root, page_path = self.get_url_parts(request)
            return redirect(settings.FRONT_WEB_URL + page_path + "?" + request.GET.urlencode())

        return super().serve(request)
