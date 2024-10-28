import { PluginListenerHandle } from "@capacitor/core";
import {
  ActionPerformed,
  LocalNotifications,
} from "@capacitor/local-notifications";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { match } from "ts-pattern";

import { useAppDispatch } from "src/stores/appStore";
import { isGershadNotificationData } from "src/types/notificationTypes";
import { mapZoomLevels } from "src/values/appValues";

const useReceiveLocalNotifications = async () => {
  const appDispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    let localNotificationActionPerformedListenerHandle: PluginListenerHandle | null =
      null;

    const addListener = async () => {
      /**
       * Redirect to HomePage with ReportGroup highestPk
       * when user tab on the notification
       */
      localNotificationActionPerformedListenerHandle =
        await LocalNotifications.addListener(
          "localNotificationActionPerformed",
          (notificationAction: ActionPerformed) => {
            console.info(
              "[useReceiveLocalNotifications] localNotificationActionPerformed event received:",
              notificationAction,
            );

            const data =
              // Android
              "data" in notificationAction.notification
                ? notificationAction.notification.data
                : // iOS
                  "extra" in notificationAction.notification
                  ? notificationAction.notification.extra
                  : undefined;

            if (typeof data !== "object") {
              console.warn(
                "[useReceiveLocalNotifications] localNotificationActionPerformed event included invalid notificationAction.notification.data, skipping:",
                notificationAction,
              );
              return null;
            }

            if (!isGershadNotificationData(data)) {
              console.warn(
                "[useReceiveLocalNotifications] localNotificationActionPerformed event included invalid notificationAction.notification.data, skipping:",
                notificationAction,
              );
              return null;
            }

            match(data)
              .with({ type: "hotZoneEntered" }, (data) => {
                console.info(
                  "[useReceiveLocalNotifications] Received hotZoneEntered notification",
                );

                appDispatch({
                  lat: data.latLng.lat,
                  lng: data.latLng.lng,
                  type: "mapLatLngAndZoomChanged",
                  zoom: mapZoomLevels.locationFocussed,
                });
              })
              .with({ type: "newReportsNearDevice" }, (data) => {
                console.info(
                  "[useReceiveLocalNotifications] Received newReportsNearDevice notification",
                );

                appDispatch({
                  lat: data.latLng.lat,
                  lng: data.latLng.lng,
                  type: "mapLatLngAndZoomChanged",
                  zoom: mapZoomLevels.locationFocussed,
                });
              })
              .with({ type: "newReportsNearPoi" }, (data) => {
                console.info(
                  "[useReceiveLocalNotifications] Received newReportsNearPoi notification",
                );

                appDispatch({
                  lat: data.latLng.lat,
                  lng: data.latLng.lng,
                  type: "mapLatLngAndZoomChanged",
                  zoom: mapZoomLevels.locationFocussed,
                });
              })
              .exhaustive();

            // if (notificationAction.notification.)

            // const notificationId = notificationAction.notification.id;
            // const channelId = notificationAction.notification.channelId;

            // if (notificationId) {
            //   match(channelId)
            //     .with(notificationChannelTypeIds.hotZoneEntered, () => {
            //       router.push(routeUrls.home({ hotzonePk: notificationId }));
            //     })
            //     .with(
            //       notificationChannelTypeIds.newReportsNearPoi,
            //       notificationChannelTypeIds.newReportsNearDevice,
            //       () => {
            //         router.push(routeUrls.home({ reportPk: notificationId }));
            //       },
            //     )
            //     .otherwise(() => null);
            // }
          },
        );

      console.info(
        "[useReceiveLocalNotifications] Added localNotificationActionPerformed listener",
      );
    };

    addListener();

    return () => {
      if (localNotificationActionPerformedListenerHandle) {
        localNotificationActionPerformedListenerHandle.remove();

        console.info(
          "[useReceiveLocalNotifications] Removed localNotificationActionPerformed listener",
        );
      }
    };
  }, [appDispatch, router]);
};

export default useReceiveLocalNotifications;
