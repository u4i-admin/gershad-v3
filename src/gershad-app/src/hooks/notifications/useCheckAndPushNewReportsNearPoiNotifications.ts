import { useCallback } from "react";

import { GqlReportGroup } from "src/generated/graphQl";
import { useAppDispatch, useAppStrings } from "src/stores/appStore";
import useScheduleAndLogLocalNotifications from "src/utils/useScheduleAndLogLocalNotifications";

const useCheckAndPushNewReportsNearPoiNotifications = () => {
  const strings = useAppStrings();
  const appDispatch = useAppDispatch();

  const scheduleAndLogLocalNotifications =
    useScheduleAndLogLocalNotifications();

  const checkAndPushNewReportsNearPoiNotifications = useCallback(
    ({ reportsNearPOI }: { reportsNearPOI: Array<GqlReportGroup> }) => {
      console.info(
        "[useCheckAndPushNewReportsNearPoiNotifications] Checking for new reports nearby POI",
      );

      if (reportsNearPOI.length === 0) return;

      //Save latest timestamp
      appDispatch({
        preferences: {
          latestReportsNearPoiNotificationTimestamp: Date.now(),
        },
        type: "updatePreferences",
      });

      scheduleAndLogLocalNotifications(
        reportsNearPOI.map((reportGroup) => ({
          body: strings.shared.notifications.newReportsNearPoi.description,
          data: {
            latLng: {
              lat: reportGroup.centroidLatitude,
              lng: reportGroup.centroidLongitude,
            },
            type: "newReportsNearPoi",
          },
          title: strings.shared.notifications.newReportsNearPoi.title,
        })),
      );
    },
    [appDispatch, scheduleAndLogLocalNotifications, strings],
  );

  return checkAndPushNewReportsNearPoiNotifications;
};
export default useCheckAndPushNewReportsNearPoiNotifications;
