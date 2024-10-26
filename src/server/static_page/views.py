import re

from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404

from rest_framework import views
from rest_framework.response import Response

from wagtail.rich_text import expand_db_html
from wagtail.images.models import Image
from wagtail_footnotes.models import Footnote

from main.permissions import GershadAPIAdminPermission
from static_page.models import (
    StaticPage, UserGuidePage, KnowYourRightsPage, BestPracticesPage)
from static_page.serializers import StaticPageSerializer
from static_page.utils import get_live_page_or_preview


class StaticPageView(views.APIView):
    """
    View to Create and View Report
    """
    permission_classes = [GershadAPIAdminPermission]

    def get(self, request, format=None):

        slug = request.data['slug']

        page = get_object_or_404(
            StaticPage,
            slug=slug,
            live=True)
        serializer = StaticPageSerializer(page)
        return Response(serializer.data)


class UserGuideList(views.APIView):
    """
    View to List User Guide questions
    """
    permission_classes = [GershadAPIAdminPermission]

    def get(self, request, format=None):

        questions = get_object_or_404(
            UserGuidePage,
            live=True)

        questions = [question['value'] for question in questions.questions.raw_data]

        for question in questions:
            question['icon'] = str(Image.objects.get(pk=question['icon']).file)

        return JsonResponse(questions, safe=False)


def get_footnotes_from_text(texts):
    """
    Returns a list of footnotes dicts(keys: uuid, text) from a list of strings
    """
    uuid_pattern = r'[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
    uuids = []
    for text in texts:
        uuids.extend(re.findall(uuid_pattern, text))

    footnotes = Footnote.objects.filter(uuid__in=uuids).distinct()

    return [{'uuid': footnote.uuid, 'text': footnote.text} for footnote in footnotes]


def convert_rich_text(html_body):
    """
    Converts Wagtail rich text data to the editor’s format
    """
    return expand_db_html(html_body)


def replace_footnotes_tag_with_anchor(html_body):
    """
    Replaces `<footnote id="footnote.uuid">[...]</footnote>`
    with `<a href="#footnote.uuid" class="footnote-ref">[....]</a>`
    """
    return convert_rich_text(html_body)\
        .replace('<footnote id="', '<a class="footnote-ref" href="#')\
        .replace('</footnote>', '</a>')


def render_rich_text(html_body):
    """
    Adds RTL direction for div element,
    converts footnotes tags and returns frontend html
    """
    if not html_body or html_body.isspace():
        return ''
    return replace_footnotes_tag_with_anchor(f'<div dir="rtl">{html_body}</div>')


class KnowYourRightsList(views.APIView):
    """
    View to List KYR chapters and sections
    """
    permission_classes = [GershadAPIAdminPermission]

    def get(self, request, format=None, previewToken=None):

        previewToken = request.GET.get('previewToken', None)
        kyrs = get_live_page_or_preview(KnowYourRightsPage, previewToken)
        if not kyrs:
            return HttpResponse('Page Not Found')

        chapters = []
        faqs = kyrs.faq_topics.raw_data
        if faqs:
            topics_section_texts = {}
            for topic in faqs:
                section_text = ''
                for issue in topic['value']['issues']:
                    section_text += f'<h3>{issue["value"]["title"]}</h3><p>{issue["value"]["description"]}</p>'
                    for faq in issue['value']['faqs']:
                        section_text += f"<h5>{faq['value']['title']}</h5><h6>{faq['value']['description']}</h6>{faq['value']['faq_text']}"
                topics_section_texts[topic['value']['topic_id']] = section_text

            faq_description = kyrs.faq_description if kyrs.faq_description else ''

            chapters.append(
                {
                    'id': 0,
                    'title': kyrs.faq_title,
                    'description': render_rich_text(faq_description),
                    'is_faq': True,
                    'sections': [
                        {
                            'id': topic['value']['topic_id'],
                            'title': topic['value']['title'],
                            'description': '',
                            'section_text': render_rich_text(topics_section_texts[topic['value']['topic_id']]),
                            'section_footnotes': get_footnotes_from_text([topics_section_texts[topic['value']['topic_id']]])
                        } for topic in faqs
                    ],
                    'chapter_footnotes': get_footnotes_from_text([faq_description])
                }
            )
        for chapter in kyrs.chapters.raw_data:
            chapters.append(
                {
                    'id': chapter['value']['chapter_id'],
                    'title': chapter['value']['title'],
                    'description': render_rich_text(chapter["value"]["description"]),
                    'is_faq': False,
                    'sections': [
                        {
                            'id': section['value']['section_id'],
                            'title': section['value']['title'],
                            'description': render_rich_text(section["value"]["description"]),
                            'section_text': render_rich_text(section["value"]["section_text"]),
                            'section_footnotes': get_footnotes_from_text([section['value']['description'], section['value']['section_text']])
                        } for section in chapter['value']['sections']
                    ],
                    'chapter_footnotes': get_footnotes_from_text([chapter['value']['description']])
                }
            )

        return JsonResponse(chapters, safe=False)


class BestPracticesList(views.APIView):
    """
    View to List Best Practices
    """
    permission_classes = [GershadAPIAdminPermission]

    def get(self, request, format=None):

        previewToken = request.GET.get('previewToken', None)
        best_practices = get_live_page_or_preview(BestPracticesPage, previewToken)
        if not best_practices:
            return HttpResponse('Page Not Found')

        titles = []
        for title in best_practices.titles.raw_data:
            titles.append(
                {
                    'id': title['value']['title_id'],
                    'title': title['value']['title'],
                    'story_text': render_rich_text(title["value"]["story_text"]),
                    'expert_analysis': [
                        {
                            'id': analysis['value']['expert_id'],
                            'title': analysis['value']['title'],
                            'analysis': render_rich_text(analysis["value"]["analysis"]),
                            'analysis_footnotes': get_footnotes_from_text([analysis["value"]["analysis"]])
                        } for analysis in title['value']['expert_analysis']
                    ],
                    'title_footnotes': get_footnotes_from_text([title['value']['story_text']])
                }
            )

        return JsonResponse(titles, safe=False)
