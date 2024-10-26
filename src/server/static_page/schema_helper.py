import strawberry

from main.types.richtext import RichTextFieldType
from main.types.generic import GenericBlock


@strawberry.type
class TextBlock(GenericBlock):

    @strawberry.field
    def text(self, info) -> RichTextFieldType:
        return self.value


@strawberry.type
class CollapsibleBlock(GenericBlock):

    @strawberry.field
    def resolve_slug(self, info) -> str:
        return self.value['slug']

    @strawberry.field
    def resolve_heading(self, info) -> str:
        return self.value['heading']

    @strawberry.field
    def resolve_text(self, info) -> str:
        return self.value['text']


@strawberry.type
class LinkBlock(GenericBlock):
    pass


@strawberry.type
class EmailBlock(GenericBlock):
    pass
