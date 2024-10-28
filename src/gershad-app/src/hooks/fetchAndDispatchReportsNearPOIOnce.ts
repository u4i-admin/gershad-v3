import { useEffect, useRef } from "react";

import useCheckAndPushNewReportsNearPoiNotifications from "src/hooks/notifications/useCheckAndPushNewReportsNearPoiNotifications";
import {
  useAppDispatch,
  useAppPreferencesLatestHotZonesFetchTimestamp,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";

const useFetchAndDispatchReportsNearPOIOnce = () => {
  const dispatch = useAppDispatch();
  const strings = useAppStrings();
  const userToken = useAppUserToken();
  const latestReportsNearPoiFetchTimestamp =
    useAppPreferencesLatestHotZonesFetchTimestamp();

  const hasDispatched = useRef(false);
  const checkAndPushNewReportsNearPoiNotifications =
    useCheckAndPushNewReportsNearPoiNotifications();

  useEffect(() => {
    const fetchAndDispatchHotZonesOnce = async () => {
      if (hasDispatched.current) {
        return;
      }

      try {
        const graphQlSdk = await getGraphQlSdk();

        const timeInSeconds = Math.floor(
          latestReportsNearPoiFetchTimestamp / 1000,
        );

        const reportsResponse = await graphQlSdk.getReportsNearPOI({
          after: timeInSeconds,
          token: userToken,
        });

        const reports = (reportsResponse?.reportsNearPoi || []).reduce(
          (acc, edge) => (edge ? [...acc, edge] : acc),
          [],
        );

        console.warn("New Reports near POI:", reports);

        if (!reports) {
          dispatch({
            messageStringKey: "shared.toasts.dataLoadFailed",
            messageType: "error",
            type: "snackbarQueued",
          });
        } else {
          checkAndPushNewReportsNearPoiNotifications({
            reportsNearPOI: reports,
          });

          dispatch({
            preferences: {
              latestReportsNearPoiFetchTimestamp: Date.now(),
            },
            type: "updatePreferences",
          });

          hasDispatched.current = true;
        }
      } catch (error) {
        console.error(
          "[useFetchAndDispatchReportsNearPOIOnce] Error while fetching:",
          error,
        );

        dispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
      }
    };

    fetchAndDispatchHotZonesOnce();
  }, [
    checkAndPushNewReportsNearPoiNotifications,
    dispatch,
    latestReportsNearPoiFetchTimestamp,
    strings,
    userToken,
  ]);
};

export default useFetchAndDispatchReportsNearPOIOnce;
