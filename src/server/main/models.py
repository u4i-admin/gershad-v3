from django.db import models


class DatedMixin(models.Model):
    class Meta:
        ordering = ['-id']
        abstract = True

    created = models.DateTimeField(
        auto_now_add=True)

    modified = models.DateTimeField(
        auto_now=True)
