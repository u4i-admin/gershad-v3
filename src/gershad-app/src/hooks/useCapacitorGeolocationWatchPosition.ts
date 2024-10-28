import { Geolocation, WatchPositionCallback } from "@capacitor/geolocation";
import { useCallback, useEffect } from "react";

import {
  LatLng,
  useAppBackgroundGeolocationProviderState,
  useAppBackgroundGeolocationTrackingState,
  useAppDeviceLatLng,
  useAppDispatch,
} from "src/stores/appStore";

const positionOptions: PositionOptions = {
  enableHighAccuracy: true,
};

const useCapacitorGeolocationWatchPosition = () => {
  const appDispatch = useAppDispatch();

  const appBackgroundGeolocationProviderState =
    useAppBackgroundGeolocationProviderState();

  const appBackgroundGeolocationTrackingState =
    useAppBackgroundGeolocationTrackingState();

  const appDeviceLatLng = useAppDeviceLatLng();

  const appDeviceLatLngIsSet = !!appDeviceLatLng;

  const positionSuccessCallback = useCallback<WatchPositionCallback>(
    (positionOrError) => {
      if (positionOrError instanceof Error) {
        console.warn(
          "[useCapacitorGeolocationWatchPosition] positionSuccessCallback: Failed to get position with error:",
          positionOrError,
        );
        appDispatch({ type: "deviceLatLngUpdateFailed" });
        return;
      }

      if (positionOrError === null) {
        console.warn(
          "[useCapacitorGeolocationWatchPosition] positionSuccessCallback: Received null position:",
          positionOrError,
        );
        appDispatch({ type: "deviceLatLngUpdateFailed" });
        return;
      }

      const latLng: LatLng = {
        lat: positionOrError.coords.latitude,
        lng: positionOrError.coords.longitude,
      };

      console.info(
        "[useCapacitorGeolocationWatchPosition] Got current position:",
        { ...latLng, accuracy: positionOrError.coords.accuracy },
      );

      console.info("Assuming position");

      appDispatch({
        ...latLng,
        shouldBeOffset: !!process.env.NEXT_PUBLIC_DEV_OFFSET_LATLNG,
        type: "deviceLatLngChanged",
      });
    },
    [appDispatch],
  );

  useEffect(() => {
    console.info("[useCapacitorGeolocationWatchPosition] Setting up watch…");

    let watchPositionId: string | null = null;

    const watchPosition = async () => {
      watchPositionId = await Geolocation.watchPosition(
        positionOptions,
        positionSuccessCallback,
      );
    };

    // We set up the watch in these cases:
    //
    // - BackgroundGeolocation ISN’T running (probably because the required
    //   permissions haven’t been granted)
    // - BackgroundGeolocation IS running but appDeviceLatLng hasn’t been set
    //   (since Geolocation is faster to get location on startup)
    if (
      appBackgroundGeolocationProviderState.type === "granted" &&
      (!appDeviceLatLngIsSet ||
        appBackgroundGeolocationTrackingState === "disabled" ||
        appBackgroundGeolocationTrackingState === "ready")
    ) {
      watchPosition();
    }

    return () => {
      if (watchPositionId) {
        Geolocation.clearWatch({ id: watchPositionId });
      }
    };
  }, [
    appBackgroundGeolocationProviderState.type,
    appBackgroundGeolocationTrackingState,
    appDeviceLatLngIsSet,
    positionSuccessCallback,
  ]);
};

export default useCapacitorGeolocationWatchPosition;
