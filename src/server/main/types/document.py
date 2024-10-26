import uuid
import datetime
import mimetypes

import strawberry
import strawberry_django

from typing import Optional, List

from wagtail.documents import get_document_model

from main.types.tag import FlatTags
from main.types.generic import GenericScalar
from main.media_storage import get_s3_url


Document = get_document_model()


@strawberry_django.type(Document, pagination=True)
class DocumentNode(strawberry.relay.Node):
    """
    Document Node
    """

    id: strawberry.relay.NodeID[int]
    file_size: Optional[int]
    url: Optional[str]
    file_type: Optional[str]
    content_type: Optional[str]
    file_hash: str
    title: str
    file: str
    created_at: datetime.datetime

    @strawberry.field
    def url(self) -> str:
        url = self.url
        s3_url = get_s3_url()
        if s3_url:
            url = url.replace(s3_url, '')

        return url

    @strawberry.field
    def file_type(self) -> str:
        return self.file.name.split('.')[-1].lower()

    @strawberry.field
    def content_type(self) -> str:
        return mimetypes.guess_type(self.file.name)[0]

    @strawberry.field
    def tags(self) -> Optional[List[Optional[FlatTags]]]:
        return self.tags.all().order_by('slug')


@strawberry.type
class DocumentBlock:
    """
    Document block for StreamField
    """

    id: uuid.UUID
    value: Optional[GenericScalar]

    @strawberry.field
    def document(self) -> Optional[DocumentNode]:
        return Document.objects.get(id=self.value)


@strawberry.type
class DocumentsQuery:
    """
    Document Query definition
    """

    @strawberry.field
    def document(self, pk: int) -> Optional[DocumentNode]:
        return Document.objects.get(pk=pk)

    documents: strawberry.relay.ListConnection[DocumentNode] = strawberry_django.connection()
