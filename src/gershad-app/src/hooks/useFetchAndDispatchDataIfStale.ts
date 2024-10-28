import { useCallback } from "react";

import useCheckAndPushNewReportsNearDeviceNotifications from "src/hooks/notifications/useCheckAndPushNewReportsNearDeviceNotifications";
import useCheckAndPushNewReportsNearPoiNotifications from "src/hooks/notifications/useCheckAndPushNewReportsNearPoiNotifications";
import {
  useAppDeviceLatLng,
  useAppDispatch,
  useAppPreferencesLatestHotZonesFetchTimestamp,
  useAppPreferencesLatestReportsNearDeviceFetchTimestamp,
  useAppPreferencesLatestReportsNearPoiFetchTimestamp,
  useAppUserToken,
} from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";

const backgroundHotZonesFetchInterval = Number(
  process.env.NEXT_PUBLIC_BACKGROUND_HOT_ZONES_FETCH_INTERVAL,
);
/**
 * Used for both reports near device and reports near POIs
 */
const backgroundReportsNearDeviceFetchInterval = Number(
  process.env.NEXT_PUBLIC_BACKGROUND_NEARBY_REPORTS_FETCH_INTERVAL,
);

const useFetchAndDispatchDataIfStale = () => {
  const dispatch = useAppDispatch();
  const userToken = useAppUserToken();

  const appDeviceLatLng = useAppDeviceLatLng();

  const latestHotZonesFetchTimestamp =
    useAppPreferencesLatestHotZonesFetchTimestamp();
  const latestReportsNearDeviceFetchTimestamp =
    useAppPreferencesLatestReportsNearDeviceFetchTimestamp();
  const latestReportsNearPoiFetchTimestamp =
    useAppPreferencesLatestReportsNearPoiFetchTimestamp();

  const checkAndPushNewReportsNearPoiNotifications =
    useCheckAndPushNewReportsNearPoiNotifications();

  const checkAndPushNewReportsNearDeviceNotifications =
    useCheckAndPushNewReportsNearDeviceNotifications();

  const fetchAndDispatchHotZones = useCallback(async () => {
    try {
      const graphQlSdk = await getGraphQlSdk();

      const hotZonesResponse = await graphQlSdk.getHotZones();

      const hotzones = (hotZonesResponse?.hotzones?.edges || []).reduce(
        (acc, edge) => (edge.node ? [...acc, edge.node] : acc),
        [],
      );
      if (!hotzones) {
        dispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
      } else {
        dispatch({
          hotzones,
          type: "updateHotZones",
        });
      }
    } catch (error) {
      console.error(
        "[useFetchAndDispatchDataIfStale] Error in updateHotZonesOnBackground:",
        error,
      );

      dispatch({
        messageStringKey: "shared.toasts.dataLoadFailed",
        messageType: "error",
        type: "snackbarQueued",
      });
    }
  }, [dispatch]);

  const fetchAndDispatchReportsNearDevice = useCallback(async () => {
    try {
      if (!appDeviceLatLng?.lat || !appDeviceLatLng?.lng) {
        return;
      }

      const graphQlSdk = await getGraphQlSdk();

      const reportsNearDeviceResponse = await graphQlSdk.getReports({
        latitude: appDeviceLatLng.lat,
        longitude: appDeviceLatLng.lng,
        radius: Number(process.env.NEXT_PUBLIC_REPORTS_RADIUS),
      });

      if (reportsNearDeviceResponse.reports) {
        checkAndPushNewReportsNearDeviceNotifications({
          reportGroups: reportsNearDeviceResponse.reports,
        });
      }
    } catch (error) {
      console.error(
        "[useFetchAndDispatchDataIfStale] Error in updatesReportsOnBackground:",
        error,
      );
      dispatch({
        messageStringKey: "shared.toasts.dataLoadFailed",
        messageType: "error",
        type: "snackbarQueued",
      });
    }
  }, [
    appDeviceLatLng?.lat,
    appDeviceLatLng?.lng,
    checkAndPushNewReportsNearDeviceNotifications,
    dispatch,
  ]);

  const fetchAndDispatchReportsNearPois = useCallback(async () => {
    try {
      const graphQlSdk = await getGraphQlSdk();

      const latestReportsNearPoiFetchTimestampInSeconds = Math.floor(
        latestReportsNearPoiFetchTimestamp / 1000,
      );

      // TODO: pass deviceLatLng to getReports
      const nearbyReportsResponse = await graphQlSdk.getReportsNearPOI({
        after: latestReportsNearPoiFetchTimestampInSeconds,
        token: userToken,
      });

      const nearbyReportGroups = (
        nearbyReportsResponse.reportsNearPoi || []
      ).reduce((acc, edge) => (edge ? [...acc, edge] : acc), []);

      checkAndPushNewReportsNearPoiNotifications({
        reportsNearPOI: nearbyReportGroups,
      });
    } catch (error) {
      console.error(
        "[useFetchAndDispatchDataIfStale] Error in updatesReportsOnBackground:",
        error,
      );
      dispatch({
        messageStringKey: "shared.toasts.dataLoadFailed",
        messageType: "error",
        type: "snackbarQueued",
      });
    }
  }, [
    latestReportsNearPoiFetchTimestamp,
    userToken,
    checkAndPushNewReportsNearPoiNotifications,
    dispatch,
  ]);

  const fetchAndDispatchDataIfStale = useCallback(() => {
    console.info(
      "[useFetchAndDispatchDataIfStale] fetchAndDispatchDataIfStale",
    );

    const now = Date.now();

    const reportsNearDeviceTimeElapsed = Math.floor(
      (now - latestReportsNearDeviceFetchTimestamp) / 1000,
    );
    const reportsNearPoisTimeElapsed = Math.floor(
      (now - latestReportsNearPoiFetchTimestamp) / 1000,
    );
    const hotzonesTimeElapsed = Math.floor(
      (now - latestHotZonesFetchTimestamp) / 1000,
    );

    console.info(
      `[useFetchAndDispatchDataIfStale] Checking if new data needs to be fetched (hot zones: ${hotzonesTimeElapsed}/${backgroundHotZonesFetchInterval}, reports near device: ${reportsNearDeviceTimeElapsed}/${backgroundReportsNearDeviceFetchInterval}), reports near POIs: ${reportsNearPoisTimeElapsed}/${backgroundReportsNearDeviceFetchInterval})`,
    );

    if (hotzonesTimeElapsed >= backgroundHotZonesFetchInterval) {
      console.info(
        "[fetchAndDispatchDataIfStale] Fetching and dispatching new hot zones",
      );

      fetchAndDispatchHotZones();

      dispatch({
        preferences: {
          latestHotZonesFetchTimestamp: now,
        },
        type: "updatePreferences",
      });
    }

    if (
      reportsNearDeviceTimeElapsed >= backgroundReportsNearDeviceFetchInterval
    ) {
      console.info(
        "[fetchAndDispatchDataIfStale] Fetching and dispatching new reports near device",
      );

      fetchAndDispatchReportsNearDevice();

      dispatch({
        preferences: {
          latestReportsNearDeviceFetchTimestamp: now,
        },
        type: "updatePreferences",
      });
    }

    if (
      reportsNearPoisTimeElapsed >= backgroundReportsNearDeviceFetchInterval
    ) {
      console.info(
        "[fetchAndDispatchDataIfStale] Fetching and dispatching new reports near POIs",
      );

      fetchAndDispatchReportsNearPois();

      dispatch({
        preferences: {
          latestReportsNearPoiFetchTimestamp: now,
        },
        type: "updatePreferences",
      });
    }
  }, [
    latestReportsNearDeviceFetchTimestamp,
    latestReportsNearPoiFetchTimestamp,
    latestHotZonesFetchTimestamp,
    fetchAndDispatchHotZones,
    dispatch,
    fetchAndDispatchReportsNearDevice,
    fetchAndDispatchReportsNearPois,
  ]);

  return fetchAndDispatchDataIfStale;
};

export default useFetchAndDispatchDataIfStale;
