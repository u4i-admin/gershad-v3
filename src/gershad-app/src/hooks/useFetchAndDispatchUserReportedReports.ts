import { useCallback } from "react";

import { useAppDispatch, useAppUserToken } from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";

const useFetchAndDispatchUserReportedReports = () => {
  const appDispatch = useAppDispatch();
  const userToken = useAppUserToken();

  const fetchAndDispatchUserReportedReports = useCallback(async () => {
    try {
      const graphQlSdk = await getGraphQlSdk();

      const userReportsResponse = await graphQlSdk.getReports({
        east: 180,
        north: 90,
        south: -90,
        token: userToken,
        west: -180,
      });

      const userReportedReportGroups = userReportsResponse.reports;

      if (!userReportedReportGroups) {
        appDispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
        return;
      }

      const userReportedReports = userReportedReportGroups.reduce(
        (acc, reportGroup) => {
          const reports = reportGroup.reports;

          return reports ? [...acc, ...reports] : acc;
        },
        [],
      );

      if (userReportedReports.length >= 1) {
        appDispatch({
          type: "userReportsLoaded",
          userReportedReports,
        });
      }
    } catch (error) {
      console.error(
        "[useFetchAndDispatchUserReportedReportsOnce] Error in fetchAndDispatchUserReportedReportsOnce:",
        error,
      );
      appDispatch({
        messageStringKey: "shared.toasts.dataLoadFailed",
        messageType: "error",
        type: "snackbarQueued",
      });
    }
  }, [appDispatch, userToken]);

  return fetchAndDispatchUserReportedReports;
};

export default useFetchAndDispatchUserReportedReports;
