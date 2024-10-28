import { useCallback, useEffect } from "react";

import {
  useAppDeviceLatLng,
  useAppDispatch,
  useAppHotzones,
  useAppMapLatLngAndZoom,
  useAppPreferencesDeviceInsideHotZonePks,
  useAppPreferencesLatestHotZoneEnteredNotificationTimestamps,
  useAppStrings,
} from "src/stores/appStore";
import useScheduleAndLogLocalNotifications from "src/utils/useScheduleAndLogLocalNotifications";

const useCheckAndPushHotZoneEnteredNotifications = () => {
  const strings = useAppStrings();
  const appDispatch = useAppDispatch();
  const hotzones = useAppHotzones();
  const preferencesDeviceInsideHotZonePks =
    useAppPreferencesDeviceInsideHotZonePks();
  const deviceLatLng = useAppDeviceLatLng();
  const mapLatLngAndZoom = useAppMapLatLngAndZoom();

  const latestNotificationTimestamps =
    useAppPreferencesLatestHotZoneEnteredNotificationTimestamps();

  const scheduleAndLogLocalNotifications =
    useScheduleAndLogLocalNotifications();

  const checkAndPushHotZoneEnteredNotifications = useCallback(
    ({ position }: { position: google.maps.LatLngLiteral }) => {
      console.info(
        "[useCheckAndPushHotZoneEnteredNotifications] Checking for nearby hotzones",
      );

      const currentTime = Date.now();

      const hotzonesNearBy = hotzones.filter((hotzone) => {
        const distance =
          window.google.maps.geometry?.spherical.computeDistanceBetween(
            {
              lat: hotzone.centroidLocation.y,
              lng: hotzone.centroidLocation.x,
            },
            position,
          );

        console.info(
          `[useCheckAndPushHotZoneEnteredNotifications] Checking for nearby hotzones. Distance from hotzone ${hotzone.pk}: ${distance}`,
        );

        return distance < Number(process.env.NEXT_PUBLIC_HOTZONES_RADIUS);
      });

      const hotZonesToNotify = hotzonesNearBy.filter((hotzone) => {
        if (preferencesDeviceInsideHotZonePks.includes(hotzone.pk)) {
          console.info(
            `[useCheckAndPushHotZoneEnteredNotifications] Hotzone ${hotzone.pk} is nearby, but device was already inside hot zone so user has already been notified.`,
          );

          return false;
        }

        if (
          latestNotificationTimestamps &&
          latestNotificationTimestamps[hotzone.pk] &&
          currentTime - latestNotificationTimestamps[hotzone.pk] < 3600000
        ) {
          console.info(
            `[useCheckAndPushHotZoneEnteredNotifications] Hotzone ${hotzone.pk} is nearby, but user has been notified in the past hour`,
          );
          return false;
        }

        return true;
      });

      if (hotZonesToNotify.length > 0) {
        scheduleAndLogLocalNotifications(
          hotZonesToNotify.map((hotzone) => ({
            body: strings.shared.notifications.hotZoneEntered.description,
            data: {
              latLng: {
                lat: hotzone.centroidLocation.y,
                lng: hotzone.centroidLocation.x,
              },
              type: "hotZoneEntered",
            },
            title: strings.shared.notifications.hotZoneEntered.title,
          })),
        );

        appDispatch({
          preferences: {
            latestHotZoneEnteredNotificationTimestamps: {
              ...latestNotificationTimestamps,
              ...hotZonesToNotify.reduce(
                (acc, hotzone) => ({ ...acc, [hotzone.pk]: currentTime }),
                {},
              ),
            },
          },
          type: "updatePreferences",
        });
      }

      if (
        !(hotzonesNearBy.length === preferencesDeviceInsideHotZonePks.length) ||
        !hotzonesNearBy.every((hotZone) =>
          preferencesDeviceInsideHotZonePks.includes(hotZone.pk),
        )
      ) {
        appDispatch({
          preferences: {
            deviceInsideHotZonePks: hotzonesNearBy.map((hotZone) => hotZone.pk),
          },
          type: "updatePreferences",
        });
      }
    },
    [
      appDispatch,
      hotzones,
      latestNotificationTimestamps,
      preferencesDeviceInsideHotZonePks,
      scheduleAndLogLocalNotifications,
      strings,
    ],
  );

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_DEV_USE_MAP_LOCATION_FOR_PROXIMITY_NOTIFICATIONS
    ) {
      checkAndPushHotZoneEnteredNotifications({ position: mapLatLngAndZoom });
    }
  }, [checkAndPushHotZoneEnteredNotifications, mapLatLngAndZoom]);

  useEffect(() => {
    if (
      !process.env
        .NEXT_PUBLIC_DEV_USE_MAP_LOCATION_FOR_PROXIMITY_NOTIFICATIONS &&
      deviceLatLng
    ) {
      checkAndPushHotZoneEnteredNotifications({ position: deviceLatLng });
    }
  }, [checkAndPushHotZoneEnteredNotifications, deviceLatLng]);
};
export default useCheckAndPushHotZoneEnteredNotifications;
