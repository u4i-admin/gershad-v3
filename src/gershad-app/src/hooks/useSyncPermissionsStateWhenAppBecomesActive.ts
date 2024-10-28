import { LocalNotifications } from "@capacitor/local-notifications";
import BackgroundGeolocation from "@transistorsoft/capacitor-background-geolocation";
import { useEffect } from "react";

import GershadCheckPermissionsPlugin from "src/plugins/GershadCheckPermissionsPlugin";
import {
  useAppBackgroundGeolocationProviderState,
  useAppDispatch,
  useAppIsActive,
  useAppLocalNotificationsPermissionState,
  useAppMotionPermissionState,
} from "src/stores/appStore";
import backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState from "src/utils/backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState";
import safeGeolocationCheckPermissions from "src/utils/geoLocation/safeGeolocationCheckPermissions";
import { isNativePlatform } from "src/values/appValues";

const useSyncPermissionsStateWhenAppBecomesActive = () => {
  const appDispatch = useAppDispatch();
  const appIsActive = useAppIsActive();

  const appLocalNotificationsPermissionState =
    useAppLocalNotificationsPermissionState();

  const appBackgroundGeolocationProviderState =
    useAppBackgroundGeolocationProviderState();

  const appMotionPermissionState = useAppMotionPermissionState();
  // Consider the cases user changes the permission setting (upgrade permission level)
  // Case 1: Users nav to setting, change the permission then nav back to app
  // Case 2: Every time users open the app
  useEffect(() => {
    if (!appIsActive) {
      return;
    }

    (async () => {
      try {
        if (!isNativePlatform) {
          return;
        }

        const newLocalNotificationsPermissionState =
          await LocalNotifications.checkPermissions();

        if (
          newLocalNotificationsPermissionState.display !==
          appLocalNotificationsPermissionState
        ) {
          appDispatch({
            localNotificationsPermissionState:
              newLocalNotificationsPermissionState.display,
            type: "localNotificationsPermissionStateChanged",
          });
        }

        const newBackgroundGeolocationProviderRawState =
          await BackgroundGeolocation.getProviderState();

        const newBackgroundGeolocationProviderState =
          backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState(
            newBackgroundGeolocationProviderRawState,
          );

        const locationPermissionState = await safeGeolocationCheckPermissions();

        if (
          locationPermissionState &&
          locationPermissionState.location === "prompt"
        ) {
          newBackgroundGeolocationProviderState["type"] = "notDetermined";
        }

        if (
          JSON.stringify(newBackgroundGeolocationProviderState) !==
          JSON.stringify(appBackgroundGeolocationProviderState)
        ) {
          appDispatch({
            backgroundGeolocationProviderState:
              newBackgroundGeolocationProviderState,
            type: "backgroundGeolocationProviderStateChanged",
          });
        }

        const { permissionState: newMotionPermissionState } =
          await GershadCheckPermissionsPlugin.getMotionPermissionState();

        if (newMotionPermissionState !== appMotionPermissionState) {
          appDispatch({
            motionPermissionState: newMotionPermissionState,
            type: "motionPermissionStateChanged",
          });
        }
      } catch (error) {
        console.error(
          "[useSyncPermissionsStateWhenAppBecomesActive]:failed to sync permission state ",
          error,
        );
      }
    })();
  }, [
    appIsActive,
    appDispatch,
    appLocalNotificationsPermissionState,
    appBackgroundGeolocationProviderState,
    appMotionPermissionState,
  ]);
};

export default useSyncPermissionsStateWhenAppBecomesActive;
