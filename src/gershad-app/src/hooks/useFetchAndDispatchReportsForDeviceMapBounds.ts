import { useEffect, useRef } from "react";

import {
  useAppDeviceLatLng,
  useAppDispatch,
  useAppIsActive,
  useAppReportsRefetchRequestTimestamp,
} from "src/stores/appStore";
import { useMapDispatch, useMapGoogleMapRef } from "src/stores/mapStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import { increaseMapBounds } from "src/utils/googlemaps/increaseMapBounds";

const useFetchAndDispatchReportsForMapBounds = ({
  updateGoogleMapStates,
}: {
  updateGoogleMapStates: () => Promise<void>;
}) => {
  const mapRef = useMapGoogleMapRef();
  const appIsActive = useAppIsActive();
  const appDispatch = useAppDispatch();
  const mapDispatch = useMapDispatch();

  const deviceLatLng = useAppDeviceLatLng();

  const latestRefetchReportsRequestTimestamp =
    useAppReportsRefetchRequestTimestamp();

  const deviceLatLngIsSet = !!deviceLatLng;

  const previousGetReportsBounds = useRef<google.maps.LatLngBoundsLiteral>();

  useEffect(() => {
    const getReports = async () => {
      const mapBounds = mapRef.current?.getBounds()?.toJSON();

      if (
        !appIsActive ||
        !mapBounds ||
        !deviceLatLngIsSet ||
        (mapBounds &&
          previousGetReportsBounds.current &&
          mapBounds.north === previousGetReportsBounds.current.north &&
          mapBounds.east === previousGetReportsBounds.current.east &&
          mapBounds.south === previousGetReportsBounds.current.south &&
          mapBounds.west === previousGetReportsBounds.current.west)
      ) {
        console.info(
          `[useFetchAndDispatchReportsForMapBounds] Skipping getting reports for timestamp ${latestRefetchReportsRequestTimestamp} because bounds haven’t changed`,
        );

        return;
      }

      console.info(
        `[useFetchAndDispatchReportsForMapBounds] Getting reports for timestamp ${latestRefetchReportsRequestTimestamp}`,
      );

      try {
        const graphQlSdk = await getGraphQlSdk();

        const reportsResponse = await graphQlSdk.getReports({
          // Fetch 4x the dimensions of the current viewport so we don’t end up
          // fetching report groups containing different subsets of reports
          // contained in the viewport
          ...increaseMapBounds(4, mapBounds),
          // token: userToken,
          // containsReportWithToken:
        });

        const reportsInBounds = (reportsResponse.reports || []).reduce(
          (acc, edge) => (edge ? [...acc, edge] : acc),
          [],
        );

        updateGoogleMapStates();

        appDispatch({
          reportGroups: reportsInBounds,
          type: "reportGroupsLoaded",
        });
      } catch (error) {
        console.error("[GoogleMap] Error in getReports:", error);
        appDispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
      }
    };

    getReports();
  }, [
    appDispatch,
    appIsActive,
    deviceLatLngIsSet,
    latestRefetchReportsRequestTimestamp,
    mapDispatch,
    mapRef,
    updateGoogleMapStates,
  ]);
};

export default useFetchAndDispatchReportsForMapBounds;
