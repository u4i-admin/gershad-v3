import strawberry

from wagtail.rich_text import expand_db_html
from main.media_storage import get_s3_url

from typing import NewType


def serialize(value):
    """
    Serialises RichText content into fully baked HTML
    see https://github.com/wagtail/wagtail/issues/2695#issuecomment-373002412
    """
    s3_url = get_s3_url()
    html = expand_db_html(value)
    if s3_url is not None:
        html = html.replace(s3_url, '')

    return html


RichTextFieldType = strawberry.scalar(
    NewType("RichTextFieldType", object),
    description="Serialises RichText content into fully baked HTML",
    serialize=lambda v: serialize(v),
    parse_value=lambda v: v,
)
