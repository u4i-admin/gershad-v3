# Generated by Django 3.2.21 on 2023-10-30 16:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0004_report_ttl'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='report',
            name='ttl',
        ),
    ]