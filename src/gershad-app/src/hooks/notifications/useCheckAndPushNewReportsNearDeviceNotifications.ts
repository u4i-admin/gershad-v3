import { useCallback } from "react";

import { GqlReport, GqlReportGroup } from "src/generated/graphQl";
import {
  useAppDispatch,
  useAppPreferencesLatestReportsNearDeviceNotificationTimestamp,
  useAppStrings,
  useAppUserReports,
} from "src/stores/appStore";
import useScheduleAndLogLocalNotifications from "src/utils/useScheduleAndLogLocalNotifications";

const useCheckAndPushNewReportsNearDeviceNotifications = () => {
  const strings = useAppStrings();
  const appDispatch = useAppDispatch();
  const appUserReports = useAppUserReports();

  const scheduleAndLogLocalNotifications =
    useScheduleAndLogLocalNotifications();

  const latestNotificationTimestamp =
    useAppPreferencesLatestReportsNearDeviceNotificationTimestamp();

  const checkAndPushNewReportsNearDeviceNotifications = useCallback(
    ({ reportGroups }: { reportGroups: Array<GqlReportGroup> }) => {
      console.info(
        "[useCheckAndPushNewReportsNearDeviceNotifications] Checking for new reports nearby device",
      );

      if (reportGroups.length === 0) return;

      const newReports = reportGroups.reduce<Array<GqlReport>>(
        (acc, reportGroup) => {
          const newReports = (reportGroup.reports ?? []).filter((report) => {
            const reportTimestamp = new Date(report.created).getTime();

            const isNew = reportTimestamp > latestNotificationTimestamp;

            const isUserReport = appUserReports.some(
              (userReport) => userReport.pk === report.pk,
            );

            // console.log(
            //   "[useCheckAndPushNewReportsNearDeviceNotifications] Determining if report is new:",
            //   {
            //     difference: reportTimestamp - latestNotificationTimestamp,
            //     isNew,
            //     isUserReport,
            //     latestNotificationTimestamp,
            //     reportTimestamp,
            //   },
            // );

            return isNew && !isUserReport;
          });

          return [...acc, ...newReports];
        },
        [],
      );

      if (newReports.length > 0) {
        scheduleAndLogLocalNotifications(
          newReports.map((report) => ({
            body: strings.shared.notifications.newReportsNearDevice.description,
            // channelId: notificationChannelTypeIds.newReportsNearDevice,
            data: {
              latLng: {
                lat: report.location.y,
                lng: report.location.x,
              },
              type: "newReportsNearDevice",
            },
            title: strings.shared.notifications.newReportsNearDevice.title,
          })),
        );
      }

      appDispatch({
        preferences: {
          latestReportsNearDeviceNotificationTimestamp: Date.now(),
        },
        type: "updatePreferences",
      });
    },
    [
      appDispatch,
      appUserReports,
      latestNotificationTimestamp,
      scheduleAndLogLocalNotifications,
      strings,
    ],
  );

  return checkAndPushNewReportsNearDeviceNotifications;
};
export default useCheckAndPushNewReportsNearDeviceNotifications;
