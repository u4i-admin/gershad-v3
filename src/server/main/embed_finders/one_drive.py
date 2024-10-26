import re
from wagtail.embeds.finders.base import EmbedFinder


class OneDriveEmbedFinder(EmbedFinder):
    """
    A custom embed finder for embedding One Drive videos
    """

    def accept(self, url):
        pattern = r'^(https):\/\/((www\.onedrive\.live|onedrive\.live)\.com/.*)$'
        return re.match(pattern, url)

    def find_embed(self, url, max_width=None):
        iframe = f'<iframe src="{url}" width="640" height="480" frameborder="0" scrolling="no"></iframe>'
        return {
            'title': '',
            'author_name': '',
            'provider_name': 'One Drive',
            'type': 'rich',
            'thumbnail_url': None,
            'width': None,
            'height': None,
            'html': iframe,
        }


embed_finder_class = OneDriveEmbedFinder
