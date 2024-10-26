from rest_framework import serializers

from static_page.models import StaticPage


class StaticPageSerializer(serializers.ModelSerializer):
    """
    Serializer for Static Page
    """
    class Meta:
        model = StaticPage
        fields = ['title', 'slug', 'published', 'body']
        read_only_fields = ['title', 'slug', 'published', 'body']
