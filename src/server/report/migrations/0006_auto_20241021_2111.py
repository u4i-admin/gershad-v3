# Generated by Django 3.2.25 on 2024-10-21 21:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0005_remove_report_ttl'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='report',
            name='cluster',
        ),
        migrations.DeleteModel(
            name='Cluster',
        ),
    ]