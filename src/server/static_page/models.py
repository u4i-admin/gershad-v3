import magic

from django.db import models
from django import forms

from wagtail.models import Page
from wagtail.admin.forms import WagtailAdminPageForm
from wagtail.admin.panels import FieldPanel, MultiFieldPanel, InlinePanel
from wagtail.fields import StreamField, RichTextField
from wagtail.documents.models import Document, AbstractDocument
from wagtail.images.blocks import ImageChooserBlock
from wagtail import blocks

from static_page.mixins import PreviewMixin


class CustomDocument(AbstractDocument):

    admin_form_fields = Document.admin_form_fields

    def clean(self):
        # Validate content-type based on settings.WAGTAILDOCS_EXTENSIONS
        allowable_types = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/rtf',
            'text/rtf',
            'text/plain',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.oasis.opendocument.text',
            'application/vnd.oasis.opendocument.spreadsheet',
            'application/vnd.oasis.opendocument.presentation',
        ]
        try:
            filetype = magic.from_buffer(self.file.file.read(2048), mime=True)
            if filetype not in allowable_types:
                raise forms.ValidationError('The file was not uploaded. File type is not permitted.')
        except ValueError:
            raise forms.ValidationError('The file was not uploaded. File type is not permitted.')


class StaticPage(PreviewMixin, Page):
    """
    Static Pages to be defined for the site
    """

    published = models.DateField(
        'Post Date')

    body = RichTextField()

    parent_page_types = [Page, ]

    content_panels = Page.content_panels + [
        FieldPanel('published'),
        FieldPanel('body'),
    ]


class QuestionBlock(blocks.StructBlock):
    """
    Question block definition (StreamBlock)
    """

    question = blocks.TextBlock()

    answer = blocks.TextBlock()

    icon = ImageChooserBlock()


class UserGuidePage(PreviewMixin, Page):
    """
    A Page that includes all questions in User Guide
    """

    max_count_per_parent = 1

    parent_page_types = [Page, ]

    questions = StreamField([
        ('question', QuestionBlock(icon='help'))
    ], use_json_field=True)

    content_panels = Page.content_panels + [
        FieldPanel('questions'),
    ]

    class Meta:
        verbose_name = 'User Guide'
        verbose_name_plural = 'User Guides'


class SectionBlock(blocks.StructBlock):
    """
    Section block definition (subblock of chapter)
    """

    section_id = blocks.IntegerBlock()

    title = blocks.CharBlock()

    description = blocks.RichTextBlock(required=False)

    section_text = blocks.RichTextBlock()


class ChapterBlock(blocks.StructBlock):
    """
    Chapter block definition (subblock of KYR)
    """

    chapter_id = blocks.IntegerBlock()

    title = blocks.CharBlock()

    description = blocks.RichTextBlock(required=False)

    sections = blocks.StreamBlock([
        ('section', SectionBlock(label_format='{title}')),
    ], required=False)


class FAQBlock(blocks.StructBlock):
    """
    FAQ block definition (subblock of Issue)
    """

    faq_id = blocks.IntegerBlock()

    title = blocks.CharBlock(required=False)

    description = blocks.RichTextBlock(required=False)

    faq_text = blocks.RichTextBlock()


class IssueBlock(blocks.StructBlock):
    """
    Issue block definition (subblock of Topic)
    """

    issue_id = blocks.IntegerBlock()

    title = blocks.CharBlock(required=False)

    description = blocks.RichTextBlock(required=False)

    faqs = blocks.StreamBlock([
        ('faq', FAQBlock(label_format='{title}')),
    ])


class TopicBlock(blocks.StructBlock):
    """
    Topic block definition (subblock of KYR-FAQ)
    """

    topic_id = blocks.IntegerBlock()

    title = blocks.CharBlock()

    issues = blocks.StreamBlock([
        ('issue', IssueBlock(label_format='{title}')),
    ])


class KnowYourRightsFrom(WagtailAdminPageForm):

    def clean(self):  # noqa C901
        cleaned_data = super().clean()

        chapters = cleaned_data.get('chapters', None)
        if chapters:
            chapter_ids = [
                chapter['value']['chapter_id'] for chapter in cleaned_data['chapters'].raw_data]
            if len(chapter_ids) != len(set(chapter_ids)):
                raise forms.ValidationError(f'Found duplicate Chapter IDs')

            for chapter in cleaned_data['chapters'].raw_data:
                chapter_id = chapter['value']['chapter_id']
                section_ids = []
                if 'sections' in chapter['value']:
                    for section in chapter['value']['sections']:
                        section_ids.append(section['value']['section_id'])
                    if len(section_ids) != len(set(section_ids)):
                        raise forms.ValidationError(f'Found duplicate Section ID in Chapter {chapter_id}')

        faq_topics = cleaned_data.get('faq_topics', None)
        if faq_topics:
            topic_ids = [
                topic['value']['topic_id'] for topic in cleaned_data['faq_topics'].raw_data]
            if len(topic_ids) != len(set(topic_ids)):
                raise forms.ValidationError(f'Found duplicate Topic IDs')

            for topic in cleaned_data['faq_topics'].raw_data:
                topic_id = topic['value']['topic_id']
                issue_ids = []
                if 'issues' in topic['value']:
                    for issue in topic['value']['issues']:
                        issue_id = issue['value']['issue_id']
                        issue_ids.append(issue['value']['issue_id'])
                        faq_ids = []
                        if 'faqs' in issue['value']:
                            for faq in issue['value']['faqs']:
                                faq_ids.append(faq['value']['faq_id'])
                        if len(faq_ids) != len(set(faq_ids)):
                            raise forms.ValidationError(f'Found duplicate FAQ ID in Topic {topic_id}, Issue {issue_id}')
                    if len(issue_ids) != len(set(issue_ids)):
                        raise forms.ValidationError(f'Found duplicate Issue ID in Topic {topic_id}')

        return cleaned_data


class KnowYourRightsPage(PreviewMixin, Page):
    """
    A Page that includes all KYR chapters
    """

    max_count_per_parent = 1

    parent_page_types = [Page, ]

    faq_title = models.CharField(
        max_length=250,
        default='FAQ')

    faq_description = RichTextField(
        null=True,
        blank=True)

    faq_topics = StreamField(
        [
            ('topic', TopicBlock(label_format='{title}')),
        ],
        null=True,
        blank=True,
        use_json_field=True)

    chapters = StreamField([
        ('chapter', ChapterBlock(label_format='{title}'))
    ], use_json_field=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('faq_title'),
            FieldPanel('faq_description'),
            FieldPanel('faq_topics'),
        ], heading='FAQ'),
        FieldPanel('chapters'),
        InlinePanel('footnotes', label='Footnotes'),
    ]

    base_form_class = KnowYourRightsFrom


class ExpertAnalysisBlock(blocks.StructBlock):
    """
    Expert Analysis block definition (subblock of Title block)
    """

    expert_id = blocks.IntegerBlock()

    title = blocks.CharBlock()

    analysis = blocks.RichTextBlock()


class TitleBlock(blocks.StructBlock):
    """
    Title block definition (subblock of BestPractices page)
    """

    title_id = blocks.IntegerBlock()

    title = blocks.CharBlock()

    story_text = blocks.RichTextBlock(required=False)

    expert_analysis = blocks.StreamBlock([
        ('expert_analysis', ExpertAnalysisBlock(label_format='{title}')),
    ])


class BestPracticesForm(WagtailAdminPageForm):

    def clean(self):
        cleaned_data = super().clean()

        titles = cleaned_data.get('titles', None)
        if titles:
            title_ids = [
                title['value']['title_id'] for title in cleaned_data['titles'].raw_data]
            if len(title_ids) != len(set(title_ids)):
                raise forms.ValidationError(f'Found duplicate Title IDs')

            for title in cleaned_data['titles'].raw_data:
                title_id = title['value']['title_id']
                expert_ids = []
                if 'expert_analysis' in title['value']:
                    for analysis in title['value']['expert_analysis']:
                        expert_ids.append(analysis['value']['expert_id'])
                    if len(expert_ids) != len(set(expert_ids)):
                        raise forms.ValidationError(f'Found duplicate expert ID in Title {title_id}')

        return cleaned_data


class BestPracticesPage(PreviewMixin, Page):
    """
    A Page that includes all Best Practices
    """

    max_count_per_parent = 1

    parent_page_types = [Page, ]

    titles = StreamField([
        ('title', TitleBlock(label_format='{title}'))
    ], use_json_field=True)

    content_panels = Page.content_panels + [
        FieldPanel('titles'),
        InlinePanel('footnotes', label='Footnotes'),
    ]

    base_form_class = BestPracticesForm
