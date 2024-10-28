import { useEffect, useRef } from "react";

import useFetchAndDispatchUserReportedReports from "src/hooks/useFetchAndDispatchUserReportedReports";
import { useAppReportsRefetchRequestTimestamp } from "src/stores/appStore";

const useFetchAndDispatchUserReportsOnceAndWhenRequested = () => {
  const appReportsRefetchRequestTimestamp =
    useAppReportsRefetchRequestTimestamp();

  const fetchAndDispatchUserReportedReports =
    useFetchAndDispatchUserReportedReports();

  const hasDispatched = useRef(false);

  // Fetch once at startup
  useEffect(() => {
    if (hasDispatched.current) {
      return;
    }

    fetchAndDispatchUserReportedReports();

    hasDispatched.current = true;
  }, [fetchAndDispatchUserReportedReports]);

  // Fetch when appLatestRefetchUserReportsRequestTimestamp changes
  useEffect(() => {
    fetchAndDispatchUserReportedReports();
  }, [appReportsRefetchRequestTimestamp, fetchAndDispatchUserReportedReports]);
};

export default useFetchAndDispatchUserReportsOnceAndWhenRequested;
