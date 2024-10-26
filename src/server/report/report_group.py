from django.utils import timezone
from django.conf import settings

from django.contrib.gis.db.models.functions import Centroid
from django.contrib.gis.geos import MultiPoint

from .models import Report


class ReportGroup():
    def create_from(self, reports, center=None):
        first = reports[0]
        self.lastUpdate = first.modified
        if center is None or len(reports) == 1:
            self.centroidLatitude = first.location.y
            self.centroidLongitude = first.location.x
        else:
            self.centroidLatitude = center.y
            self.centroidLongitude = center.x
        self.verified = False
        self.score = 1
        type_of_max = first.type
        self.permanent = False
        if len(reports) > 1:
            type_count = {}
            score = 0
            for report in reports:
                self.lastUpdate = report.modified if report.modified > self.lastUpdate else self.lastUpdate
                self.verified = self.verified | report.verified
                if report.type in type_count:
                    type_count[report.type] += 1
                else:
                    type_count[report.type] = 1
                score += report.reporter.reputation
                type_of_max = max(type_count, key=type_count.get)
                report.token = report.reporter.token
                report.client = report.reporter.client
                self.permanent |= report.permanent
            self.score = score / len(reports)
        else:
            first.token = first.reporter.token
            first.client = first.reporter.client
            self.permanent = first.permanent
        self.type = type_of_max
        self.reports = list(reports)
        self.reportCount = len(reports)
        if self.permanent:
            self.faded = 1.0
        else:
            self.faded = 1.0 if self.lastUpdate > timezone.now() - timezone.timedelta(hours=settings.FADED_HOURS) else 0.5

        return self


class ReportGroupList():
    def create_from(self, reports, combine_types=False):
        if len(reports) == 1:
            return [ReportGroup().create_from(reports)]
        else:
            groups = {}
            for report in reports:
                centroid = (report.location.y, report.location.x)
                type = report.type
                if combine_types:
                    key = centroid
                else:
                    key = (centroid, type)
                if key in groups:
                    groups[key].append(report)
                else:
                    groups[key] = [report]
            report_groups = []
            for group in groups.values():
                group.sort(key=lambda report: report.created, reverse=True)
                multi_point = MultiPoint(list(report.location for report in group))
                multi_point.srid = settings.SRID
                centroid = Centroid(multi_point)
                reports = Report.objects.annotate(mp_center=centroid)
                report_groups.append(ReportGroup().create_from(group, reports[0].mp_center))
            return report_groups
