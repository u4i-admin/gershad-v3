// This is only used by Android version but AFAIK there’s no way to
// conditionally import it
import "overlayscrollbars/overlayscrollbars.css";

import { Capacitor, PermissionState } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { ConnectionStatus, Network } from "@capacitor/network";
import createCache from "@emotion/cache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import BackgroundGeolocation, {
  ProviderChangeEvent,
} from "@transistorsoft/capacitor-background-geolocation";
import { AppProps } from "next/app";
import { FC, memo, Suspense, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { prefixer as stylisPrefixer } from "stylis";
import stylisPluginRtl from "stylis-plugin-rtl";
import { match } from "ts-pattern";

import ClientSideErrorFallback from "src/components/ClientSideErrorFallback";
import { defaultLatLng } from "src/components/HomePage/GoogleMap/GoogleMap";
import Layout from "src/components/Layout";
import MuiThemeProvider from "src/components/MuiThemeProvider";
import useDynamicFocusOutlines from "src/hooks/app/useDynamicFocusOutlines";
import useFocusMainHeadingOnRouteChange from "src/hooks/app/useFocusMainHeadingOnRouteChange";
import useInitializeAndWatchAppIsActive from "src/hooks/app/useInitializeAndWatchAppIsActive";
import useInitialPathAndDeepLinkRouting from "src/hooks/app/useInitialPathAndDeepLinkRouting";
import useLoadAppPreferences from "src/hooks/app/useLoadAppPreferences";
import useFetchAndDispatchHotzonesOnce from "src/hooks/fetchAndDispatchHotzonesOnce";
import useFetchAndDispatchPointsOfInterestOnce from "src/hooks/fetchAndDispatchPointsOfInterestOnce";
import useFetchAndDispatchReportsNearPOIOnce from "src/hooks/fetchAndDispatchReportsNearPOIOnce";
import useCheckAndPushHotZoneEnteredNotifications from "src/hooks/notifications/useCheckAndPushHotZoneEnteredNotifications";
import useBackgroundGeoLocation from "src/hooks/useBackgroundGeoLocation";
import useCapacitorGeolocationWatchPosition from "src/hooks/useCapacitorGeolocationWatchPosition";
import useFetchAndDispatchUserReportedReportsOnceAndWhenRequested from "src/hooks/useFetchAndDispatchUserReportedReportsOnceAndWhenRequested";
import useLoadGoogleMapsApi from "src/hooks/useLoadGoogleMapsApi";
import useLoadOverlayScrollbarsComponent from "src/hooks/useLoadOverlayScrollbarsComponent";
import useQueueNoInternetConnectionSnackbarIfNotConnected from "src/hooks/useQueueNoInternetConnectionSnackbarIfNotConnected";
import useReceiveLocalNotifications from "src/hooks/useReceiveLocalNotifications";
import useSyncPermissionsStateWhenAppBecomesActive from "src/hooks/useSyncPermissionsStateWhenAppBecomesActive";
import useTrackingCurrentLocation from "src/hooks/useTrackingCurrentLocation";
import useUpdateConnectionStatusOnNetworkStatusChange from "src/hooks/useUpdateConnectionStatusOnNetworkStatusChange";
import GershadCheckPermissionsPlugin from "src/plugins/GershadCheckPermissionsPlugin";
import {
  AppLocaleInfo,
  AppProvider,
  AppState,
  useAppOverlayScrollbarsComponent,
} from "src/stores/appStore";
import stringsEn from "src/strings/stringsEn";
import stringsFa from "src/strings/stringsFa";
import { LocaleCode } from "src/types/routeTypes";
import backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState from "src/utils/backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState";
import updateDocumentLocaleAttributes from "src/utils/document/updateDocumentLocaleAttributes";
import safeGeolocationCheckPermissions from "src/utils/geoLocation/safeGeolocationCheckPermissions";
import getLocaleMetadata from "src/utils/getLocaleMetadata";
import loadAndStoreCognitoIdentityId from "src/utils/loadAndStoreCognitoIdentityId";
import { isNativePlatform, mapZoomLevels } from "src/values/appValues";

const GershadApp: FC<AppProps> = memo(({ Component, pageProps }) => {
  useInitializeAndWatchAppIsActive();
  useDynamicFocusOutlines();
  useCheckAndPushHotZoneEnteredNotifications();
  useFetchAndDispatchPointsOfInterestOnce();
  useFetchAndDispatchHotzonesOnce();
  useFetchAndDispatchUserReportedReportsOnceAndWhenRequested();
  useFocusMainHeadingOnRouteChange();

  useLoadOverlayScrollbarsComponent();
  useCapacitorGeolocationWatchPosition();
  useTrackingCurrentLocation();
  useFetchAndDispatchReportsNearPOIOnce();
  useUpdateConnectionStatusOnNetworkStatusChange();
  useBackgroundGeoLocation();
  useSyncPermissionsStateWhenAppBecomesActive();
  useQueueNoInternetConnectionSnackbarIfNotConnected();
  useReceiveLocalNotifications();

  const googleMapsApiIsLoaded = useLoadGoogleMapsApi();

  const OverlayScrollbars = useAppOverlayScrollbarsComponent();

  const { incomingInitialPath } = useInitialPathAndDeepLinkRouting();

  if (OverlayScrollbars === undefined) {
    return <></>;
  }

  // Don’t render anything until we know there’s no initial
  if (
    typeof incomingInitialPath === "undefined" ||
    typeof incomingInitialPath === "string" ||
    !googleMapsApiIsLoaded
  ) {
    return null;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
});

GershadApp.displayName = "GershadApp";

const GershadAppWrapper: FC<AppProps> = (props) => {
  const { router } = props;

  const [providerValues, setProviderValues] = useState<{
    appStoreInitialState: AppState;
    emotionCache: EmotionCache;
  }>();

  const preferences = useLoadAppPreferences();

  useEffect(() => {
    const fetchLocaleCode = async () => {
      if (!preferences || providerValues) {
        return;
      }

      const localeCode = match(preferences.localeCode)
        .returnType<LocaleCode>()
        .with("en", "fa", (localeCode) => localeCode)
        .otherwise(() => "fa");

      updateDocumentLocaleAttributes(localeCode);

      const { dateTimeFormatter, direction } = getLocaleMetadata(localeCode);

      const localeInfo: AppLocaleInfo = {
        dateTimeFormatter,
        direction,
        localeCode,
      };

      const userToken = await loadAndStoreCognitoIdentityId();

      const connectionStatus: ConnectionStatus = await (async () => {
        try {
          return await Network.getStatus();
        } catch (error) {
          const fallbackConnectionStatus: ConnectionStatus = {
            connected: false,
            connectionType: "unknown",
          };
          console.error(
            "[_app] Error while calling Network.getStatus():",
            error,
            `Falling back to default: ${JSON.stringify(
              fallbackConnectionStatus,
            )}`,
          );

          return fallbackConnectionStatus;
        }
      })();

      const localNotificationsPermissionState = (
        await LocalNotifications.checkPermissions()
      ).display;

      const motionPermissionState: PermissionState = isNativePlatform
        ? (await GershadCheckPermissionsPlugin.getMotionPermissionState())
            .permissionState
        : "granted"; // For testing we pretend motion is granted on web

      const backgroundGeolocationProviderRawState: ProviderChangeEvent =
        isNativePlatform
          ? await BackgroundGeolocation.getProviderState()
          : await (async () => {
              const geolocationPermissions = await navigator.permissions.query({
                name: "geolocation",
              });

              return {
                accuracyAuthorization:
                  geolocationPermissions.state === "granted"
                    ? BackgroundGeolocation.ACCURACY_AUTHORIZATION_FULL
                    : BackgroundGeolocation.ACCURACY_AUTHORIZATION_REDUCED,
                enabled: true,
                gps: true,
                network: true,
                status:
                  geolocationPermissions.state === "granted"
                    ? BackgroundGeolocation.AUTHORIZATION_STATUS_WHEN_IN_USE
                    : BackgroundGeolocation.AUTHORIZATION_STATUS_DENIED,
              };
            })();

      const backgroundGeolocationProviderState =
        backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState(
          backgroundGeolocationProviderRawState,
        );

      const locationPermissionState = await safeGeolocationCheckPermissions();

      if (
        locationPermissionState &&
        locationPermissionState.location === "prompt"
      ) {
        backgroundGeolocationProviderState["type"] = "notDetermined";
      }

      setProviderValues({
        appStoreInitialState: {
          appIsActive: undefined,
          backgroundGeolocationProviderState,
          backgroundGeolocationTrackingState: Capacitor.isNativePlatform()
            ? undefined
            : "disabled",
          connectionStatus,
          deviceIsMoving: false,
          deviceLatLng: null,
          deviceLatLngUpdateCompleteTime: null,
          deviceLatLngUpdateRequestTime: null,
          faqsPageContent: undefined,
          googleMapsApiState: "loading",
          hotzones: [],
          knowYourRightsPageContent: undefined,
          localeInfo,
          localNotificationsPermissionState,
          mapHasBeenCenteredOnDeviceLatLng: false,
          mapLatLngAndZoom: {
            ...defaultLatLng,
            zoom: mapZoomLevels.default,
          },
          menuDrawerIsOpen: false,
          motionPermissionState,
          OverlayScrollbarsComponent: undefined,
          pointsOfInterest: [],
          preferences,
          reportGroupHasBeenDisplayedAtCurrentMapLatLng: false,
          reportGroups: [],
          reportsRefetchRequestTimestamp: 0,
          snackbarIsOpen: false,
          snackbarQueue: [],
          // Both stringsEn and stringsFa will be bundled. If we add more locales
          // in the future we might want to dynamically import the required
          // strings instead, but here it wouldn’t be worth the trouble since the
          // bundle size is less significant for native apps.
          strings: localeCode === "en" ? stringsEn : stringsFa,
          userReports: [],
          userToken: userToken ?? "",
        },
        emotionCache: createCache({
          key: "e",
          stylisPlugins: [
            stylisPrefixer,
            // https://mui.com/material-ui/guides/right-to-left/
            ...(localeInfo.direction === "rtl" ? [stylisPluginRtl] : []),
          ],
        }),
      });
    };
    fetchLocaleCode();
  }, [preferences, providerValues, router]);

  const errorBoundaryResetKeys = useMemo(
    () => [router.asPath],
    [router.asPath],
  );

  if (!providerValues) {
    return null;
  }

  // StrictMode disabled because of compatibility issues with
  // "@react-google-maps/api". We might be able to re-enable this at a later
  // date.
  return (
    // <StrictMode>
    <CacheProvider value={providerValues.emotionCache}>
      <AppProvider initialState={providerValues.appStoreInitialState}>
        <MuiThemeProvider>
          <Suspense>
            <ErrorBoundary
              FallbackComponent={ClientSideErrorFallback}
              resetKeys={errorBoundaryResetKeys}
            >
              <GershadApp {...props} />
            </ErrorBoundary>
          </Suspense>
        </MuiThemeProvider>
      </AppProvider>
    </CacheProvider>
    // </StrictMode>
  );
};

export default GershadAppWrapper;
