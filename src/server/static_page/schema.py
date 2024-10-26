import datetime
from typing import Iterable, List, Optional, NewType

import strawberry
import strawberry_django
from strawberry_django.pagination import OffsetPaginationInput

from main.types.generic import GenericScalar
from main.types.image import ImageBlock
from main.types.richtext import RichTextFieldType
from main.utils import Connection

from static_page.models import (
    StaticPage, KnowYourRightsPage, BestPracticesPage, UserGuidePage)
from static_page.views import (
    convert_rich_text,
    get_footnotes_from_text,
    replace_footnotes_tag_with_anchor)

from wagtail.models import Page
from wagtail.images.models import Image


@strawberry_django.filters.filter(StaticPage, lookups=True)
class StaticPageFilter:
    title: strawberry.auto
    published: strawberry.auto
    slug: strawberry.auto


@strawberry_django.type(StaticPage, pagination=True, filters=StaticPageFilter)
class StaticPageNode(strawberry.relay.Node):
    """
    Relay: Static Page Node
    """

    id: strawberry.relay.NodeID[int]
    title: str
    slug: str
    numchild: int
    url_path: str
    seo_title: str
    search_description: str
    published: datetime.date

    @classmethod
    def get_queryset(cls, queryset, info, **kwargs):
        return queryset.live()

    @strawberry.field
    def body(self) -> RichTextFieldType:
        return convert_rich_text(self.body)


FootnoteType = strawberry.scalar(
    NewType("FootnoteType", object),
    description="""
    Type to represent a footnote, e.g:
    {
        "uuid": "41ae8f0e-d348-44aa-9067-5a56bcc083e5",
        "text": "<p data-block-key=\"chnrx\">Test Footnote Text </p>"
    }
    """
)


@strawberry_django.filters.filter(KnowYourRightsPage, lookups=True)
class KnowYourRightsPageFilter:
    title: strawberry.auto
    slug: strawberry.auto


@strawberry_django.type(
    KnowYourRightsPage, pagination=True, filters=KnowYourRightsPageFilter)
class KnowYourRightsPageNode(strawberry.relay.Node):
    """
    Relay: Know Your Rights Page Node
    """

    id: strawberry.relay.NodeID[int]
    title: str
    slug: str
    numchild: int
    url_path: str
    seo_title: str
    search_description: str
    faq_title: strawberry.auto

    @classmethod
    def get_queryset(cls, queryset, info, **kwargs):
        return queryset.live()

    @strawberry.field
    def faq_description(self) -> RichTextFieldType:
        return replace_footnotes_tag_with_anchor(self.faq_description)

    @strawberry.field
    def faq_footnotes(self) -> Optional[List[Optional[FootnoteType]]]:
        return get_footnotes_from_text(self.faq_description)

    @strawberry.field
    def chapters(self) -> Optional[List['ChapterBlock']]:
        """
        Return repr based on block type
        """

        def repr_page(value):
            cls = Page.objects.get(pk=value).specific_class
            if cls == KnowYourRightsPage:
                return KnowYourRightsPageBlock(value=value)

            return None

        def repr_others(block_type, value):
            if block_type == 'chapter':
                return ChapterBlock(value=value)
            return None

        repr_chapters = []
        for block in self.chapters.raw_data:

            block_type = block.get('type')
            value = block.get('value')

            if block_type == 'page':
                block = repr_page(value)
                if block is not None:
                    repr_chapters.append(block)
            else:
                block = repr_others(block_type, value)
                if block is not None:
                    repr_chapters.append(block)

        return repr_chapters

    @strawberry.field
    def faq_topics(self) -> Optional[List['TopicBlock']]:
        """
        Return repr based on block type
        """

        def repr_page(value):
            cls = Page.objects.get(pk=value).specific_class
            if cls == KnowYourRightsPage:
                return KnowYourRightsPageBlock(value=value)

            return None

        def repr_others(block_type, value):
            if block_type == 'topic':
                return TopicBlock(value=value)
            return None

        repr_faqs = []
        for block in self.faq_topics.raw_data:

            block_type = block.get('type')
            value = block.get('value')

            if block_type == 'page':
                block = repr_page(value)
                if block is not None:
                    repr_faqs.append(block)
            else:
                block = repr_others(block_type, value)
                if block is not None:
                    repr_faqs.append(block)

        return repr_faqs


@strawberry.type
class KnowYourRightsPageBlock:
    """
    KnowYourRightsPage block for StreamField
    """

    value: strawberry.Private[GenericScalar]

    @strawberry.field
    def page(self) -> Optional[KnowYourRightsPageNode]:
        return KnowYourRightsPage.objects.get(id=self.value, live=True)


@strawberry.type
class FAQBlock:
    """
    FAQ block for StreamField
    """

    @strawberry.field
    def faq_id(self) -> int:
        return self['value']['faq_id']

    @strawberry.field
    def title(self) -> str:
        return self['value']['title']

    @strawberry.field
    def description(self) -> RichTextFieldType:
        return replace_footnotes_tag_with_anchor(self['value']['description'])

    @strawberry.field
    def faq_text(self) -> RichTextFieldType:
        return replace_footnotes_tag_with_anchor(self['value']['faq_text'])

    @strawberry.field
    def faq_footnotes(self) -> Optional[List[Optional[FootnoteType]]]:
        return get_footnotes_from_text([
            self['value']['description'],
            self['value']['faq_text']
        ])


@strawberry.type
class IssueBlock:
    """
    Issue block for StreamField
    """

    @strawberry.field
    def issue_id(self) -> int:
        return self['value']['issue_id']

    @strawberry.field
    def title(self) -> str:
        return self['value']['title']

    @strawberry.field
    def description(self) -> RichTextFieldType:
        return replace_footnotes_tag_with_anchor(self['value']['description'])

    @strawberry.field
    def faqs(self) -> Optional[List[Optional[FAQBlock]]]:
        return self['value']['faqs']

    @strawberry.field
    def issue_footnotes(self) -> Optional[List[Optional[FootnoteType]]]:
        return get_footnotes_from_text(self['value']['description'])


@strawberry.type
class TopicBlock:
    """
    Topic block for StreamField
    """

    value: strawberry.Private[GenericScalar]

    @strawberry.field
    def topic_id(self) -> int:
        return self.value['topic_id']

    @strawberry.field
    def title(self) -> str:
        return self.value['title']

    @strawberry.field
    def issues(self) -> Optional[List[Optional[IssueBlock]]]:
        return self.value['issues']


@strawberry.type
class QuestionBlock:
    """
    Question block for StreamField
    """

    value: strawberry.Private[GenericScalar]

    @strawberry.field
    def question(self) -> str:
        return self.value['question']

    @strawberry.field
    def answer(self) -> str:
        return self.value['answer']

    @strawberry.field
    def icon(self) -> ImageBlock:
        return Image.objects.get(id=self.value['icon'])


@strawberry.type
class ChapterSectionBlock:
    """
    Chapter Section block for StreamField
    """

    @strawberry.field
    def section_id(self) -> int:
        return self['value']['section_id']

    @strawberry.field
    def title(self) -> str:
        return self['value']['title']

    @strawberry.field
    def description(self) -> RichTextFieldType:
        return replace_footnotes_tag_with_anchor(self['value']['description'])

    @strawberry.field
    def section_text(self) -> RichTextFieldType:
        return replace_footnotes_tag_with_anchor(self['value']['section_text'])

    @strawberry.field
    def section_footnotes(self) -> Optional[List[Optional[FootnoteType]]]:
        return get_footnotes_from_text([
            self['value']['description'],
            self['value']['section_text']
        ])


@strawberry.type
class ChapterBlock:
    """
    Chapter block for StreamField
    """

    value: strawberry.Private[GenericScalar]

    @strawberry.field
    def chapter_id(self) -> int:
        return self.value['chapter_id']

    @strawberry.field
    def title(self) -> str:
        return self.value['title']

    @strawberry.field
    def description(self) -> RichTextFieldType:
        return replace_footnotes_tag_with_anchor(self.value['description'])

    @strawberry.field
    def sections(self) -> Optional[List[ChapterSectionBlock]]:
        return self.value['sections']

    @strawberry.field
    def chapter_footnotes(self) -> Optional[List[Optional[FootnoteType]]]:
        return get_footnotes_from_text(self.value['description'])


@strawberry.type
class ExpertAnalysisBlock:
    """
    Expert Analysis block for StreamField
    """

    @strawberry.field
    def expert_id(self) -> int:
        return self['value']['expert_id']

    @strawberry.field
    def title(self) -> str:
        return self['value']['title']

    @strawberry.field
    def analysis(self) -> RichTextFieldType:
        return replace_footnotes_tag_with_anchor(self['value']['analysis'])

    @strawberry.field
    def analysis_footnotes(self) -> Optional[List[Optional[FootnoteType]]]:
        return get_footnotes_from_text(self['value']['analysis'])


@strawberry.type
class BestPracticesTitleBlock:
    """
    Best Practices Title block for StreamField
    """

    value: strawberry.Private[GenericScalar]

    @strawberry.field
    def title_id(self) -> int:
        return self.value['title_id']

    @strawberry.field
    def title(self) -> str:
        return self.value['title']

    @strawberry.field
    def story_text(self) -> RichTextFieldType:
        return replace_footnotes_tag_with_anchor(self.value['story_text'])

    @strawberry.field
    def expert_analysis(self) -> Optional[List[ExpertAnalysisBlock]]:
        return self.value['expert_analysis']

    @strawberry.field
    def title_footnotes(self) -> Optional[List[Optional[FootnoteType]]]:
        return get_footnotes_from_text(self.value['story_text'])


@strawberry_django.filters.filter(BestPracticesPage, lookups=True)
class BestPracticesPageFilter:
    title: strawberry.auto
    slug: strawberry.auto


@strawberry_django.type(
    BestPracticesPage, pagination=True, filters=BestPracticesPageFilter)
class BestPracticesPageNode(strawberry.relay.Node):
    """
    Relay: Best Practices Page Node
    """

    id: strawberry.relay.NodeID[int]
    title: str
    slug: str
    numchild: int
    url_path: str
    seo_title: str
    search_description: str

    @classmethod
    def get_queryset(cls, queryset, info, **kwargs):
        return queryset.live()

    @strawberry.field
    def titles(self) -> Optional[List['BestPracticesTitleBlock']]:
        """
        Return repr based on block type
        """

        def repr_page(value):
            cls = Page.objects.get(pk=value).specific_class
            if cls == BestPracticesPage:
                return BestPracticesBlock(value=value)

            return None

        def repr_others(block_type, value):
            if block_type == 'title':
                return BestPracticesTitleBlock(value=value)
            return None

        repr_titles = []
        for block in self.titles.raw_data:

            block_type = block.get('type')
            value = block.get('value')

            if block_type == 'page':
                block = repr_page(value)
                if block is not None:
                    repr_titles.append(block)
            else:
                block = repr_others(block_type, value)
                if block is not None:
                    repr_titles.append(block)

        return repr_titles


@strawberry.type
class BestPracticesBlock:
    """
    BestPracticesBlockPage block for StreamField
    """

    value: strawberry.Private[GenericScalar]

    @strawberry.field
    def page(self) -> Optional[BestPracticesPageNode]:
        return BestPracticesPage.objects.get(id=self.value, live=True)


@strawberry_django.filters.filter(UserGuidePage, lookups=True)
class UserGuidePageFilter:
    title: strawberry.auto
    slug: strawberry.auto


@strawberry_django.type(
    UserGuidePage, pagination=True, filters=UserGuidePageFilter)
class UserGuidePageNode(strawberry.relay.Node):
    """
    Relay: User Guide Page Node
    """

    id: strawberry.relay.NodeID[int]
    title: str
    slug: str
    numchild: int
    url_path: str
    seo_title: str
    search_description: str

    @classmethod
    def get_queryset(cls, queryset, info, **kwargs):
        return queryset.live()

    @strawberry.field
    def questions(self) -> Optional[List['QuestionBlock']]:
        """
        Return repr based on block type
        """

        def repr_page(value):
            cls = Page.objects.get(pk=value).specific_class
            if cls == UserGuidePage:
                return UserGuideBlock(value=value)

            return None

        def repr_others(block_type, value):
            if block_type == 'question':
                return QuestionBlock(value=value)
            return None

        repr_questions = []
        for block in self.questions.raw_data:

            block_type = block.get('type')
            value = block.get('value')

            if block_type == 'page':
                block = repr_page(value)
                if block is not None:
                    repr_questions.append(block)
            else:
                block = repr_others(block_type, value)
                if block is not None:
                    repr_questions.append(block)

        return repr_questions


@strawberry.type
class UserGuideBlock:
    """
    UserGuidePage block for StreamField
    """

    value: strawberry.Private[GenericScalar]

    @strawberry.field
    def page(self) -> Optional[UserGuidePageNode]:
        return UserGuidePage.objects.get(id=self.value, live=True)


@strawberry.type
class StaticPageQuery:
    """
    Static page Query definition
    """

    @strawberry.field
    def static_page(root, slug: str) -> Optional[StaticPageNode]:
        page = None
        try:
            page = StaticPage.objects.get(
                slug__iexact=slug,
                live=True)
        except StaticPage.DoesNotExist:
            pass

        return page

    @strawberry_django.connection(Connection[StaticPageNode])
    def static_pages(
        self,
        order_by: Optional[List[Optional[str]]] = strawberry.UNSET,
        pagination: Optional[OffsetPaginationInput] = strawberry.UNSET
    ) -> Iterable[StaticPageNode]:
        order = [] if order_by is strawberry.UNSET else order_by
        static_pages = StaticPage.objects.all().order_by(*order)
        return strawberry_django.pagination.apply(pagination, static_pages)

    @strawberry.field
    def know_your_rights_page(
            root) -> Optional[KnowYourRightsPageNode]:
        page = None

        try:
            page = KnowYourRightsPage.objects.get(
                live=True)
        except KnowYourRightsPage.DoesNotExist:
            pass

        return page

    @strawberry.field
    def best_practices_page(
            root) -> Optional[BestPracticesPageNode]:
        page = None

        try:
            page = BestPracticesPage.objects.get(
                live=True)
        except KnowYourRightsPage.DoesNotExist:
            pass

        return page

    @strawberry.field
    def user_guide_page(
            root) -> Optional[UserGuidePageNode]:
        page = None

        try:
            page = UserGuidePage.objects.get(
                live=True)
        except UserGuidePage.DoesNotExist:
            pass

        return page
