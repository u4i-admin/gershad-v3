import { Geolocation } from "@capacitor/geolocation";
import BackgroundGeolocation from "@transistorsoft/capacitor-background-geolocation";
import { useCallback, useEffect, useState } from "react";

import useFetchAndDispatchDataIfStale from "src/hooks/useFetchAndDispatchDataIfStale";
import {
  useAppBackgroundGeolocationProviderState,
  useAppDeviceIsMoving,
  useAppDeviceLatLngUpdateRequestTime,
  useAppDispatch,
  useAppIsActive,
} from "src/stores/appStore";
import { isNativePlatform } from "src/values/appValues";

const useTrackingCurrentLocation = () => {
  const deviceLatLngUpdateRequestTime = useAppDeviceLatLngUpdateRequestTime();
  const deviceIsMoving = useAppDeviceIsMoving();
  const dispatch = useAppDispatch();
  const appBackgroundGeolocationProviderState =
    useAppBackgroundGeolocationProviderState();
  const appIsActive = useAppIsActive();

  const fetchAndDispatchDataIfStale = useFetchAndDispatchDataIfStale();

  const [watchModeIsActive, setWatchModeIsActive] = useState(false);

  const stopWatchPosition = useCallback(() => {
    BackgroundGeolocation.stopWatchPosition(
      () => {
        console.info("[useTrackingCurrentLocation] Stopped watching position");
      },
      () => {
        console.error(
          "[useTrackingCurrentLocation] Failed to stop watching position",
        );
      },
    );
  }, []);

  // On appStateChange update watchModeIsActive
  useEffect(() => {
    setWatchModeIsActive(!!appIsActive);

    if (appIsActive) {
      fetchAndDispatchDataIfStale();
    }
  }, [appIsActive, fetchAndDispatchDataIfStale]);

  // When watchModeIsActive or deviceIsMoving changes start or stop BackgroundGeolocation watchPosition
  useEffect(() => {
    if (!isNativePlatform) {
      return;
    }

    if (watchModeIsActive && deviceIsMoving) {
      console.info("[useTrackingCurrentLocation] Starting watch position");

      BackgroundGeolocation.watchPosition(
        () => {
          console.info(
            "Successfully watching user current location, start to update ",
          );
        },
        (errorCode) => {
          console.warn(
            "Failed to start watching user current location with error code:",
            errorCode,
          );
        },
        { persist: false },
      );
    } else {
      stopWatchPosition();
    }

    return () => {
      stopWatchPosition();
    };
  }, [deviceIsMoving, dispatch, stopWatchPosition, watchModeIsActive]);

  // When currentLocationUpdateTime changes update AppStore location. To trigger
  // a manual location update we should call:
  //
  // `appDispatch({ type: "deviceLatLngUpdateRequested" })`
  useEffect(() => {
    const getCurrentLocation = async () => {
      if (typeof deviceLatLngUpdateRequestTime !== "number") {
        return;
      }

      console.info("[useTrackingCurrentLocation] Updating location:", {
        currentLocationRequestTime: deviceLatLngUpdateRequestTime,
      });

      if (isNativePlatform) {
        try {
          const location = await BackgroundGeolocation.getCurrentPosition({
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_MEDIUM,
          });

          dispatch({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            shouldBeOffset: !!process.env.NEXT_PUBLIC_DEV_OFFSET_LATLNG,
            type: "deviceLatLngChanged",
          });
        } catch (error) {
          console.error(
            "[useTrackingCurrentLocation] Unexpected error while getting native location:",
            error,
          );

          dispatch({ type: "deviceLatLngUpdateFailed" });
        }
      } else {
        try {
          const location = await Geolocation.getCurrentPosition();

          // const currentLatLng = {
          //   lat: currentPosition.coords.latitude,
          //   lng: currentPosition.coords.longitude,
          // };

          dispatch({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            shouldBeOffset: !!process.env.NEXT_PUBLIC_DEV_OFFSET_LATLNG,
            type: "deviceLatLngChanged",
          });
        } catch (error) {
          console.error(
            "[useTrackingCurrentLocation] Unexpected error while getting browser location:",
            error,
          );

          dispatch({ type: "deviceLatLngUpdateFailed" });
        }
      }
    };

    if (appBackgroundGeolocationProviderState.type === "granted") {
      getCurrentLocation();
    } else {
      console.info(
        "[useTrackingCurrentLocation] Cannot access current location, need geo location permission from the user",
      );

      dispatch({ type: "deviceLatLngUpdateFailed" });
    }
  }, [
    dispatch,
    deviceLatLngUpdateRequestTime,
    appBackgroundGeolocationProviderState.precise,
    appBackgroundGeolocationProviderState.type,
  ]);
};

export default useTrackingCurrentLocation;
