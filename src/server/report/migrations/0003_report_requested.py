# Generated by Django 3.2.7 on 2021-11-23 21:17

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0002_auto_20211014_1406'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='requested',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]