import re
from wagtail.embeds.finders.base import EmbedFinder


class GoogleDriveEmbedFinder(EmbedFinder):
    """
    A custom embed finder for embedding Google Drive videos
    """

    def accept(self, url):
        pattern = r'^(https):\/\/((www\.drive\.google|drive\.google)\.com/file/d/.*)$'
        return re.match(pattern, url)

    def find_embed(self, url, max_width=None):
        iframe = f'<iframe src="{url}" width="640" height="480" allow="autoplay"></iframe>'
        return {
            'title': '',
            'author_name': '',
            'provider_name': 'Google Drive',
            'type': 'rich',
            'thumbnail_url': None,
            'width': None,
            'height': None,
            'html': iframe,
        }


embed_finder_class = GoogleDriveEmbedFinder
