import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import BackgroundGeolocation, {
  ProviderChangeEvent,
} from "@transistorsoft/capacitor-background-geolocation";
import { useCallback } from "react";
import { match } from "ts-pattern";

import {
  useAppBackgroundGeolocationProviderState,
  useAppDispatch,
} from "src/stores/appStore";
import backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState from "src/utils/backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState";
import safeGeolocationCheckPermissions from "src/utils/geoLocation/safeGeolocationCheckPermissions";

const checkAndRequestGeoLocationPermissions = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.info(
      "Permission denied on web — display notice to user telling them they need to give permission in browser since we can’t use Geolocation.requestPermissions on web.",
    );

    return null;
  }

  const initialPermissionStatus = await safeGeolocationCheckPermissions();

  if (
    initialPermissionStatus?.location === "granted" ||
    initialPermissionStatus?.location === "denied"
  ) {
    return initialPermissionStatus;
  }

  const permissionStatusAfterRequest = await (async () => {
    try {
      return await Geolocation.requestPermissions({
        permissions: ["location"],
      });
    } catch (error) {
      console.error(
        "Error while calling Geolocation.requestPermissions: ",
        error,
      );
      return null;
    }
  })();

  if (permissionStatusAfterRequest?.location !== "granted") {
    console.info("User didn’t give permission when prompted");
  }

  return permissionStatusAfterRequest;
};

const useRequestGeoLocationPermissionAndUpdateAppStoreIfChanged = () => {
  const appBackgroundGeolocationProviderState =
    useAppBackgroundGeolocationProviderState();

  const appDispatch = useAppDispatch();

  const requestGeoLocationPermissionAndUpdateAppStoreIfChanged =
    useCallback(async () => {
      if (appBackgroundGeolocationProviderState.type === "granted") {
        console.info(
          "[useRequestGeoLocationPermissionAndUpdateAppStoreIfChanged] Returning initial appBackgroundGeolocationProviderState since it already had type: 'granted'",
        );

        return appBackgroundGeolocationProviderState;
      }

      const permissionStatus = await checkAndRequestGeoLocationPermissions();

      if (!permissionStatus) {
        console.error(
          "[useRequestGeoLocationPermissionAndUpdateAppStoreIfChanged] Failed to call Geolocation.checkPermissions or Geolocation.requestPermissions — returning existing appStore appBackgroundGeolocationProviderState",
        );

        return appBackgroundGeolocationProviderState;
      }

      const backgroundGeolocationProviderRawState = await (async () => {
        try {
          return await BackgroundGeolocation.getProviderState();
        } catch {
          return null;
        }
      })();

      if (!backgroundGeolocationProviderRawState) {
        console.error(
          "[useRequestGeoLocationPermissionAndUpdateAppStoreIfChanged] Failed to call BackgroundGeolocation.getProviderState — returning existing appStore appBackgroundGeolocationProviderState",
        );

        return appBackgroundGeolocationProviderState;
      }

      const backgroundGeolocationProviderRawStateAfterPermissionChange = match(
        permissionStatus,
      )
        .returnType<ProviderChangeEvent>()
        .with(
          { location: "granted" },
          { coarseLocation: "granted" },
          ({ location }) => ({
            ...backgroundGeolocationProviderRawState,
            accuracyAuthorization: location === "granted" ? 0 : 1,
            status: 4,
          }),
        )
        .otherwise(() => backgroundGeolocationProviderRawState);

      const newProviderState =
        backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState(
          backgroundGeolocationProviderRawStateAfterPermissionChange,
        );

      if (
        JSON.stringify(newProviderState) !==
        JSON.stringify(appBackgroundGeolocationProviderState)
      ) {
        appDispatch({
          backgroundGeolocationProviderState: newProviderState,
          type: "backgroundGeolocationProviderStateChanged",
        });
      }

      return newProviderState;
    }, [appBackgroundGeolocationProviderState, appDispatch]);

  return requestGeoLocationPermissionAndUpdateAppStoreIfChanged;
};

export default useRequestGeoLocationPermissionAndUpdateAppStoreIfChanged;
