# Generated by Django 3.2.7 on 2022-02-01 20:21

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('poi', '0002_pointofinterest_requested'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pointofinterest',
            name='requested',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]