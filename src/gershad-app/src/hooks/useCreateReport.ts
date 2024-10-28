import { Dispatch, SetStateAction, useCallback } from "react";

import { useAppDispatch, useAppUserToken } from "src/stores/appStore";
import { ReportOverlayState } from "src/types/reportTypes";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import {
  logAddReportFail,
  logAddReportRejectTooManyReports,
  logAddReportSuccess,
} from "src/utils/firebaseAnalytics";
import getFormattedAddress from "src/utils/googlemaps/getFormattedAddress";
import { apiClientType } from "src/values/apiValues";

const useCreateReport = () => {
  const dispatch = useAppDispatch();
  const userToken = useAppUserToken();

  const createReport = useCallback(
    async ({
      latLng,
      reportType,
      setReportState,
    }: {
      latLng: google.maps.LatLngLiteral;
      reportType: string;
      setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
    }) => {
      try {
        setReportState({ type: "isSubmittingReport" });

        const formattedAddress = await getFormattedAddress(latLng);

        if (typeof formattedAddress !== "string") {
          setReportState({
            errorType: "unexpected",
            type: "hasErrorMessages",
          });
          return;
        }

        const graphQlSdk = await getGraphQlSdk({ method: "POST" });

        const createReportResponse = await graphQlSdk.doCreateReport({
          address: formattedAddress,
          client: apiClientType,
          latitude: latLng.lat,
          longitude: latLng.lng,
          permanent: false,
          reportType,
          token: userToken,
        });

        const createReport = createReportResponse.createReport;

        if (createReport.errors) {
          const isTooManyReportsError =
            createReport.errors.nonFieldErrors[0].code === "too_many_reports";

          if (isTooManyReportsError) {
            dispatch({
              messageStringKey: "shared.toasts.reportAddRejectedTooManyReports",
              messageType: "error",
              type: "snackbarQueued",
            });
            logAddReportRejectTooManyReports();
          } else {
            // TODO: Add string
            dispatch({
              messageStringKey: "shared.toasts.reportAddFailed",
              messageType: "error",
              type: "snackbarQueued",
            });
            logAddReportFail();
          }

          logAddReportRejectTooManyReports();
        } else {
          dispatch({
            messageStringKey: "shared.toasts.reportAddSucceeded",
            messageType: "success",
            type: "snackbarQueued",
          });

          dispatch({ type: "reportsRefetchRequested" });

          logAddReportSuccess();
        }
      } catch (error) {
        console.error("Unexpected error:", error);

        setReportState({
          errorType: "noInternetConnection",
          type: "hasErrorMessages",
        });

        logAddReportFail();
      }

      setReportState({ type: "isNotReporting" });
    },
    [dispatch, userToken],
  );

  return createReport;
};

export default useCreateReport;
