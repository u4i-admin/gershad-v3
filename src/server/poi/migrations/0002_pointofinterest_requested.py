# Generated by Django 3.2.7 on 2021-11-23 21:17

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('poi', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pointofinterest',
            name='requested',
            field=models.DateTimeField(default=datetime.datetime(2021, 11, 23, 21, 17, 11, 701950, tzinfo=utc)),
        ),
    ]
