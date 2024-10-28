import {
  LocalNotifications,
  LocalNotificationSchema,
} from "@capacitor/local-notifications";
import { useCallback } from "react";
import { match, P } from "ts-pattern";

import {
  useAppBackgroundGeolocationTrackingState,
  useAppLocalNotificationsPermissionState,
  useAppPreferencesHotZoneEnteredNotificationsEnabled,
  useAppPreferencesNewReportsNearDeviceNotificationsEnabled,
  useAppPreferencesNewReportsNearPoiNotificationsEnabled,
} from "src/stores/appStore";
import { GershadNotificationData } from "src/types/notificationTypes";

// export type LocalNotificationSchemaData =
//   | {
//       hotZonePk: number;
//       latLng?: never;
//       type: "hotZoneEntered";
//     }
//   | {
//       hotZonePk?: never;
//       latLng: google.maps.LatLngLiteral;
//       type: "newReportsNearPoi";
//     };

export type LocalNotificationSchemaWithData = Omit<
  LocalNotificationSchema,
  "channelId" | "group" | "id"
> & {
  channelId?: never;
  data: GershadNotificationData;
  group?: never;
  id?: never;
};

export type PreparedLocalNotificationSchema = Omit<
  LocalNotificationSchema,
  "extra"
> & {
  extra: GershadNotificationData;
};

const copyLocalNotificationSchemaDataToExtra = (
  localNotificationSchemaWithData: LocalNotificationSchemaWithData,
): PreparedLocalNotificationSchema => {
  // See https://capacitorjs.com/docs/apis/local-notifications#localnotificationschema
  const randomId = Math.floor(Math.random() * 2147483647);

  return {
    ...localNotificationSchemaWithData,
    extra: localNotificationSchemaWithData.data,
    group: randomId.toString(),
    id: randomId,
  };
};

const useScheduleAndLogLocalNotifications = () => {
  const localNotificationsPermissionState =
    useAppLocalNotificationsPermissionState();

  const appBackgroundGeolocationTrackingState =
    useAppBackgroundGeolocationTrackingState();

  const appPreferencesHotZoneEnteredNotificationsEnabled =
    useAppPreferencesHotZoneEnteredNotificationsEnabled();

  const appPreferencesNewReportsNearDeviceNotificationsEnabled =
    useAppPreferencesNewReportsNearDeviceNotificationsEnabled();

  const appPreferencesNewReportsNearPoiNotificationsEnabled =
    useAppPreferencesNewReportsNearPoiNotificationsEnabled();

  const scheduleAndLogLocalNotifications = useCallback(
    (
      notificationOrNotifications:
        | LocalNotificationSchemaWithData
        | Array<LocalNotificationSchemaWithData>,
    ) => {
      if (localNotificationsPermissionState !== "granted") {
        console.warn(
          "[scheduleAndLogLocalNotifications] Notifications not enabled on device so won’t schedule notification(s):",
          notificationOrNotifications,
        );

        return;
      }

      if (appBackgroundGeolocationTrackingState !== "enabled") {
        console.warn(
          "[scheduleAndLogLocalNotifications] Background geolocation not running so won’t schedule notification(s):",
          notificationOrNotifications,
        );

        return;
      }

      const notifications = match(notificationOrNotifications)
        // .with(P.array(P.any), (notifications) => notifications)
        // .with(P.any, (notification) => [notification])
        .with(P.array(P.any), (notifications) =>
          notifications.map((notification) =>
            copyLocalNotificationSchemaDataToExtra(notification),
          ),
        )
        .with(P.any, (notification) => [
          copyLocalNotificationSchemaDataToExtra(notification),
        ])
        .exhaustive();

      const allowedNotifications = notifications.filter((notification) =>
        match(notification.extra.type)
          .with("hotZoneEntered", () => {
            if (!appPreferencesHotZoneEnteredNotificationsEnabled) {
              console.warn(
                "[scheduleAndLogLocalNotifications] Not scheduling notification because !appPreferencesHotZoneEnteredNotificationsEnabled:",
                notification,
              );
            }

            return appPreferencesHotZoneEnteredNotificationsEnabled;
          })
          .with("newReportsNearDevice", () => {
            if (!appPreferencesNewReportsNearDeviceNotificationsEnabled) {
              console.warn(
                "[scheduleAndLogLocalNotifications] Not scheduling notification because !appPreferencesNewReportsNearDeviceNotificationsEnabled:",
                notification,
              );
            }

            return appPreferencesNewReportsNearDeviceNotificationsEnabled;
          })
          .with("newReportsNearPoi", () => {
            if (!appPreferencesNewReportsNearPoiNotificationsEnabled) {
              console.warn(
                "[scheduleAndLogLocalNotifications] Not scheduling notification because !appPreferencesNewReportsNearPoiNotificationsEnabled:",
                notification,
              );
            }

            return appPreferencesNewReportsNearPoiNotificationsEnabled;
          })
          .exhaustive(),
      );

      if (allowedNotifications.length > 1) {
        console.info(
          "[scheduleAndLogLocalNotifications] Scheduling notifications:",
          allowedNotifications,
        );
      } else {
        console.info(
          "[scheduleAndLogLocalNotifications] Scheduling notification:",
          allowedNotifications[0],
        );
      }

      try {
        LocalNotifications.schedule({
          notifications: allowedNotifications,
        });
      } catch (error) {
        console.warn(
          "[scheduleAndLogLocalNotifications] Error while scheduling notifications:",
          error,
        );
      }
    },
    [
      appBackgroundGeolocationTrackingState,
      appPreferencesHotZoneEnteredNotificationsEnabled,
      appPreferencesNewReportsNearDeviceNotificationsEnabled,
      appPreferencesNewReportsNearPoiNotificationsEnabled,
      localNotificationsPermissionState,
    ],
  );

  return scheduleAndLogLocalNotifications;
};

export default useScheduleAndLogLocalNotifications;
