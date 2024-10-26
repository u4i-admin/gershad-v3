from django.contrib.contenttypes.models import ContentType
from wagtail_headless_preview.models import PagePreview


def get_live_page_or_preview(model, token=None):
    if token:
        page_preview = None
        try:
            content_type = ContentType.objects.get_for_model(model).id
            page_preview = PagePreview.objects.get(token=token, content_type=content_type)
        except (ContentType.DoesNotExist, PagePreview.DoesNotExist):
            return None

        return page_preview.as_page()
    else:
        page = model.objects.first()
        return page if page.live else None
