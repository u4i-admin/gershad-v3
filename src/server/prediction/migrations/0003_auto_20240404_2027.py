# Generated by Django 3.2.25 on 2024-04-04 20:27

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prediction', '0002_hotzonecluster'),
    ]

    operations = [
        migrations.RenameField(
            model_name='hotzonecluster',
            old_name='severity_level',
            new_name='hotzone_level',
        ),
        migrations.RemoveField(
            model_name='trainingdata',
            name='created',
        ),
        migrations.RemoveField(
            model_name='trainingdata',
            name='description',
        ),
        migrations.RemoveField(
            model_name='trainingdata',
            name='modified',
        ),
        migrations.AddField(
            model_name='hotzonecluster',
            name='is_manual',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='trainingdata',
            name='period_interval',
            field=models.PositiveIntegerField(default=3, help_text='Requires `Clusters by period` enabled.             Otherwise will be disregarded.              Number of hours to divide the week by.            For example 3 hours would mean 56 periods.'),
        ),
        migrations.AddField(
            model_name='trainingdata',
            name='period_overlap_end',
            field=models.PositiveIntegerField(default=0, help_text='Requires `Clusters by period` enabled.             Otherwise will be disregarded.              Number of hours that overlaps each period with its next period.'),
        ),
        migrations.AddField(
            model_name='trainingdata',
            name='period_overlap_start',
            field=models.PositiveIntegerField(default=0, help_text='Requires `Clusters by period` enabled.             Otherwise will be disregarded.            Number of hours that overlaps each period with its previous period.'),
        ),
        migrations.AddField(
            model_name='trainingdata',
            name='starting_time',
            field=models.PositiveIntegerField(default=0, help_text='Requires `Clusters by period` enabled.             Otherwise will be disregarded.              At what time of the day does the week start?            (example: 0 for 12AM, 17 for 5PM) We start dividing periods                  from that day and time. Works with `Starting Weekday`.', validators=[django.core.validators.MaxValueValidator(23), django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AddField(
            model_name='trainingdata',
            name='starting_weekday',
            field=models.PositiveIntegerField(choices=[(0, 'Monday'), (1, 'Tuesday'), (2, 'Wednesday'), (3, 'Thursday'), (4, 'Friday'), (5, 'Saturday'), (6, 'Sunday')], default=0, help_text='Requires `Clusters by period` enabled.             Otherwise will be disregarded.              On what day does the week start? We start dividing periods             from that day and time. Works with `Starting Time`.'),
        ),
        migrations.AlterField(
            model_name='hotzonecluster',
            name='is_active',
            field=models.BooleanField(default=False, help_text='If `Is Manual` is not selected, this will change automatically.'),
        ),
        migrations.AlterField(
            model_name='trainingdata',
            name='clusters_by_period',
            field=models.BooleanField(default=True, help_text='Turning this off will show all reports in a cluster            regardless of period.'),
        ),
    ]