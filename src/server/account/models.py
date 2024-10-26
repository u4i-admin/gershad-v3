from django.contrib.auth.models import AbstractUser
from django.db import models
from report.models import Reporter


class User(AbstractUser):
    """
    A custom user model based on the default django user model
    """

    reporter = models.ForeignKey(
        Reporter,
        on_delete=models.CASCADE,
        related_name='account',
        null=True,
        blank=True)
