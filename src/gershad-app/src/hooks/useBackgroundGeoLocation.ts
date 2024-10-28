import BackgroundGeolocation, {
  Subscription,
} from "@transistorsoft/capacitor-background-geolocation";
import { useCallback, useEffect } from "react";
import { match, P } from "ts-pattern";

import useFetchAndDispatchDataIfStale from "src/hooks/useFetchAndDispatchDataIfStale";
import {
  useAppBackgroundGeolocationProviderState,
  useAppBackgroundGeolocationTrackingState,
  useAppDispatch,
  useAppLocalNotificationsPermissionState,
  useAppMotionPermissionState,
  useAppPreferencesBackgroundGeolocationEnabled,
  useAppStrings,
} from "src/stores/appStore";
import backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState from "src/utils/backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState";
import { isNativePlatform } from "src/values/appValues";

const useBackgroundGeoLocation = () => {
  const dispatch = useAppDispatch();
  const strings = useAppStrings();
  const appLocalNotificationsPermissionState =
    useAppLocalNotificationsPermissionState();
  const appBackgroundGeolocationProviderState =
    useAppBackgroundGeolocationProviderState();
  const appBackgroundGeolocationTrackingState =
    useAppBackgroundGeolocationTrackingState();
  const appMotionPermissionState = useAppMotionPermissionState();

  const preferencesBackgroundGeolocationEnabled =
    useAppPreferencesBackgroundGeolocationEnabled();

  const fetchAndDispatchDataIfStale = useFetchAndDispatchDataIfStale();

  const subscribeToBackgroundGeolocationEvents = useCallback<
    () => Array<Subscription>
  >(() => {
    const onEnabledChangeSubscription = BackgroundGeolocation.onEnabledChange(
      (isEnabled) => {
        console.info("[useBackgroundGeoLocation] onEnabledChange:", isEnabled);

        dispatch({
          type: isEnabled
            ? "backgroundGeolocationEnabled"
            : "backgroundGeolocationDisabled",
        });
      },
    );

    // Subscribe to onLocation event, when we try to get user's current location, should get a event back
    const onLocationSubscription = BackgroundGeolocation.onLocation(
      (location) => {
        console.info("[useBackgroundGeoLocation] onLocation:", location);

        fetchAndDispatchDataIfStale();
      },
      (error) => {
        console.error("[useBackgroundGeoLocation] onLocation error:", error);
      },
    );

    // Subscribe to onHeartbeat event
    const onHeartbeatSubscription = BackgroundGeolocation.onHeartbeat(
      (event) => {
        console.info("[useBackgroundGeoLocation] onHeartbeat:", event);

        fetchAndDispatchDataIfStale();
      },
    );

    // Subscribe to onMotionChange event
    const onMotionChangeSubscription = BackgroundGeolocation.onMotionChange(
      (event) => {
        console.info("[useBackgroundGeoLocation] onMotionChange:", event);

        dispatch({
          deviceIsMoving: event.isMoving,
          type: "deviceIsMovingChanged",
        });
        fetchAndDispatchDataIfStale();
      },
    );

    // Note: On Android it appears that the app is killed if a permission is
    // downgraded (e.g. AUTHORIZATION_STATUS_ALWAYS →
    // AUTHORIZATION_STATUS_WHEN_IN_USE) but not upgraded (e.g.
    // AUTHORIZATION_STATUS_WHEN_IN_USE → AUTHORIZATION_STATUS_ALWAYS).
    //
    // Therefore this will only ever actually be called for the upgrade case.
    //
    // This isn’t called for changes to the "Physical activity" (motion)
    // permission.
    //
    // (iOS behavior not yet tested)
    const onProviderChangeSubscription = BackgroundGeolocation.onProviderChange(
      (backgroundGeolocationProviderState) => {
        dispatch({
          backgroundGeolocationProviderState:
            backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState(
              backgroundGeolocationProviderState,
            ),
          type: "backgroundGeolocationProviderStateChanged",
        });
      },
    );

    return [
      onEnabledChangeSubscription,
      onLocationSubscription,
      onHeartbeatSubscription,
      onMotionChangeSubscription,
      onProviderChangeSubscription,
    ];
  }, [dispatch, fetchAndDispatchDataIfStale]);

  const readyBackgroundGeolocation = useCallback(() => {
    BackgroundGeolocation.ready({
      backgroundPermissionRationale: {
        message:
          strings.shared.backgroundGeoLocation.backgroundPermissionRationale
            .message,
        negativeAction:
          strings.shared.backgroundGeoLocation.backgroundPermissionRationale
            .negativeAction,
        positiveAction:
          strings.shared.backgroundGeoLocation.backgroundPermissionRationale
            .positiveAction,
        title:
          strings.shared.backgroundGeoLocation.backgroundPermissionRationale
            .title,
      },
      debug: Boolean(
        process.env.NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DEBUG_ENABLED,
      ),
      // Prevent the BackgroundGeolocation location authorization alert from
      // ever appearing. This is redundant on Android because we already avoid
      // calling BackgroundGeolocation.start() until the required permissions
      // are set, but for iOS this is necessary to prevent the authorization
      // alert from appearing on startup (regardless of us calling
      // BackgroundGeolocation.start())
      disableLocationAuthorizationAlert: true,
      distanceFilter: process.env
        .NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DISTANCE_FILTER
        ? Number(
            process.env.NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DISTANCE_FILTER,
          )
        : undefined,
      foregroundService: true,
      heartbeatInterval: Number(
        process.env.NEXT_PUBLIC_BACKGROUND_GEOLOCATION_HEARTBEAT,
      ),
      locationAuthorizationRequest: "Always",
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      notification: {
        channelName: strings.shared.backgroundGeoLocation.notification.title,
        // TODO: Add a button to the Android notification, and a JS notification
        // event handler in the future?
        // https://transistorsoft.github.io/capacitor-background-geolocation/interfaces/notification.html#actions
        // actions: ["notificationButtonPause"],
        // TODO: Add mono/outline version of Gershad icon as largeIcon
        // largeIcon: "",
        // TODO: Maybe add pause/play icons to indicate tracking status in the future?
        // smallIcon: "",
        sticky: true,
        // TODO: Add these strings to the strings file, and update based on tracking status
        text: strings.shared.backgroundGeoLocation.notification.text,
        title: strings.shared.backgroundGeoLocation.notification.title,
      },
      persistMode: BackgroundGeolocation.PERSIST_MODE_NONE,
      preventSuspend: true,
      startOnBoot: false,
      stopOnTerminate: true,
      stopTimeout: 1,
    })
      .then((state) => {
        console.info("[useBackgroundGeoLocation] ready:", state);
        dispatch({
          backgroundGeolocationState: state.enabled ? "enabled" : "ready",
          type: "backgroundGeolocationStatusResolved",
        });
      })
      .catch((error) => {
        console.error("useBackgroundGeoLocation] ready:", error);
      });
  }, [dispatch, strings]);

  useEffect(() => {
    if (!isNativePlatform) {
      return;
    }

    match(appBackgroundGeolocationTrackingState)
      .with(undefined, () => readyBackgroundGeolocation())
      .with("startRequested", () =>
        BackgroundGeolocation.start().catch((error) => {
          console.error("Failed to start BackgroundGeolocation:", error);
        }),
      )
      .with("stopRequested", () =>
        BackgroundGeolocation.stop().catch((error) => {
          console.error("Failed to stop BackgroundGeolocation:", error);
        }),
      );
  }, [appBackgroundGeolocationTrackingState, readyBackgroundGeolocation]);

  // Request start/stop based on notification preferences
  useEffect(() => {
    if (!isNativePlatform) {
      return;
    }

    const backgroundGeolocationFeatureEnabled =
      process.env.NEXT_PUBLIC_ENABLE_BACKGROUND_GEOLOCATION === "true";

    const requiredPermissionsGranted =
      appLocalNotificationsPermissionState === "granted" &&
      appMotionPermissionState === "granted" &&
      appBackgroundGeolocationProviderState.always === true;

    match({
      appBackgroundGeolocationProviderState,
      appBackgroundGeolocationTrackingState,
      backgroundGeolocationFeatureEnabled,
      preferencesBackgroundGeolocationEnabled,
      requiredPermissionsGranted,
    })
      .with(
        {
          appBackgroundGeolocationTrackingState: P.union(
            "disabled",
            "ready",
            "stopRequested",
          ),
          backgroundGeolocationFeatureEnabled: true,
          preferencesBackgroundGeolocationEnabled: true,
          requiredPermissionsGranted: true,
        },
        () => {
          if (!process.env.NEXT_PUBLIC_ENABLE_BACKGROUND_GEOLOCATION) {
            return;
          }

          dispatch({ type: "backgroundGeolocationStartRequested" });
        },
      )
      .with(
        {
          appBackgroundGeolocationTrackingState: P.union(
            "enabled",
            "startRequested",
          ),
          preferencesBackgroundGeolocationEnabled: false,
        },
        () => {
          dispatch({ type: "backgroundGeolocationStopRequested" });
        },
      )
      .otherwise(() => {});
  }, [
    appBackgroundGeolocationProviderState,
    appBackgroundGeolocationTrackingState,
    appLocalNotificationsPermissionState,
    appMotionPermissionState,
    dispatch,
    preferencesBackgroundGeolocationEnabled,
  ]);

  useEffect(() => {
    if (!isNativePlatform) {
      return;
    }

    // Useful for debugging but noisy since
    // subscribeToBackgroundGeolocationEvents changes often:
    console.info(
      "[useBackgroundGeoLocation] Subscribing to BackgroundGeolocation events",
    );

    const backgroundGeolocationSubscriptions =
      subscribeToBackgroundGeolocationEvents();

    return () => {
      // console.info(
      //   "[useBackgroundGeoLocation] Unsubscribing from BackgroundGeolocation events:",
      // );

      backgroundGeolocationSubscriptions.forEach((subscription) =>
        subscription.remove(),
      );
    };
  }, [subscribeToBackgroundGeolocationEvents]);
};

export default useBackgroundGeoLocation;
