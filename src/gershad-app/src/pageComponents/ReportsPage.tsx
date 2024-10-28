import { useRouter } from "next/router";
import { useMemo } from "react";
import { match } from "ts-pattern";

import AppBarTop from "src/components/AppBarTop";
import PageContent from "src/components/Page/PageContent";
import PageMeta from "src/components/PageMeta";
import ReportsHeader from "src/components/ReportsPage/ReportsHeader";
import UserReportGroupMinimalList from "src/components/ReportsPage/UserReportGroupMinimalList";
import { GqlReport } from "src/generated/graphQl";
import routeUrls from "src/routeUrls";
import { useAppStrings, useAppUserReports } from "src/stores/appStore";
import { ReportFilterType } from "src/types/reportTypes";
import { PageComponent } from "src/utils/createLocalePageComponent";

// =============
// === Types ===
// =============

export type ReportsPageStrings = {
  /**
   * Page SEO description.
   */
  description: string;
  /**
   * Page title. Used in header and SEO tags.
   */
  title: string;
};

export type ReportsPageProps = {};

// ==============================
// === Next.js page component ===
// ==============================

const ReportsPage: PageComponent<ReportsPageProps> = () => {
  const strings = useAppStrings();

  const router = useRouter();

  const userReportedReports = useAppUserReports();

  const reportType: ReportFilterType = useMemo(
    () =>
      match(router.query.reportType)
        .with(
          "VAN",
          "GASHT",
          "PERMANENT",
          "STOP",
          "REPFORCE",
          (reportType) => reportType,
        )
        .otherwise(() => "ALL"),
    [router.query.reportType],
  );
  const userReports: Array<GqlReport> = useMemo(
    () =>
      match(reportType)
        .with("ALL", () => userReportedReports)
        .with(
          "PERMANENT",
          () => userReportedReports.filter((report) => report.permanent) ?? [],
        )
        .otherwise(
          () =>
            userReportedReports?.filter(
              (report) => report.type.name === reportType,
            ) ?? [],
        ),
    [reportType, userReportedReports],
  );

  return (
    <>
      <PageMeta
        canonicalPath={routeUrls.reports()}
        title={strings.ReportsPage.title}
      />

      <AppBarTop
        headingText={strings.ReportsPage.title}
        url={routeUrls.home()}
      />

      <PageContent isScrollable>
        <ReportsHeader activeReportFilterType={reportType} />
        <UserReportGroupMinimalList reports={userReports} />
      </PageContent>
    </>
  );
};

export default ReportsPage;
