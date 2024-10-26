from django.utils import timezone
from django.conf import settings
from django.core.management.base import BaseCommand

from prediction.models import HotZoneCluster
from report.models import Report


class Command(BaseCommand):
    help = """
        Dectivate/Reactivate hotzones based on the reports count.
        Add/Remove cluster reports based on their age and proximity to centroid.
    """

    def handle(self, *args, **options):

        radius = settings.HOTZONE_RADIUS_M
        max_age = settings.HOTZONE_REPORT_MAX_AGE_DAYS
        after = timezone.now() - timezone.timedelta(days=max_age)

        min_reports = settings.HOTZONE_MIN_REPORTS_REACTIVATE
        max_reports = settings.HOTZONE_MAX_REPORTS_DEACTIVATE

        if min_reports <= max_reports:
            self.stdout.write(
                self.style.ERROR(
                    'MIN_REPORTS_REACTIVATE should be higher\
                          than MAX_REPORTS_DEACTIVATE, check CI/CD values'))
            return

        hotzones = HotZoneCluster.objects.filter(is_manual=False)
        self.stdout.write(
            f'Found {hotzones.count()} hotzones in the database')

        for hotzone in hotzones:
            c_latitude = hotzone.centroid_location.y
            c_longitude = hotzone.centroid_location.x

            # Remove old reports
            old_reports_ids = hotzone.reports\
                .filter(modified__lte=after)\
                .values_list('id', flat=True).distinct()

            for report in hotzone.reports.all():
                if report.id in old_reports_ids:
                    hotzone.reports.remove(report)

            # Find new reports within the cluster
            reports_found = Report.find_by_center_and_cluster(
                c_latitude,
                c_longitude,
                after=after,
                radius=radius)
            new_reports_ids = reports_found\
                .values_list('id', flat=True)\
                .distinct()

            # Add new reports within radius
            for new_id in new_reports_ids:
                hotzone.reports.add(Report.objects.get(pk=new_id))

            reports_count = hotzone.reports.count()
            if reports_count >= min_reports:
                hotzone.is_active = True
                hotzone.save()
            elif reports_count <= max_reports:
                hotzone.is_active = False
                hotzone.save()
            else:
                hotzone.save()

            self.stdout.write(
                self.style.SUCCESS(f'Hotzone {hotzone} has been updated'))
