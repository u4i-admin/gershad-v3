import { PermissionState as CapacitorPermissionState } from "@capacitor/core";
import { ConnectionStatus } from "@capacitor/network";
import { Preferences } from "@capacitor/preferences";
import { css, SerializedStyles } from "@emotion/react";
import constate from "constate";
import type { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useReducer } from "react";
import { match, P } from "ts-pattern";

import {
  GqlHotZoneCluster,
  GqlReport,
  GqlReportGroup,
} from "src/generated/graphQl";
import { GqlFaqsPage, GqlKnowYourRightsPage } from "src/generated/graphQl";
import { GqlPointOfInterest } from "src/generated/graphQl";
import stringsEn from "src/strings/stringsEn";
import stringsFa from "src/strings/stringsFa";
import { StringKey, Strings } from "src/types/stringTypes";
import { BackgroundGeolocationProviderState } from "src/utils/backgroundGeolocationProviderChangeEventToBackgroundGeolocationProviderState";
import updateDocumentLocaleAttributes from "src/utils/document/updateDocumentLocaleAttributes";
import getStringByDotSeparatedKey from "src/utils/getStringByDotSeparatedKey";
import offsetLatLng from "src/utils/googlemaps/offsetLatLng";
import reducerLog from "src/utils/store/reducerLog";
import { capacitorPreferencesKeys } from "src/values/appValues";
import { LocaleCode } from "src/values/localeValues";

// =============
// === Types ===
// =============

export type AppPreferences = {
  backgroundGeolocationEnabled: boolean;
  deviceInsideHotZonePks: Array<number>;
  hotZoneEnteredNotificationsEnabled: boolean;
  latestHotZoneEnteredNotificationTimestamps: {
    [hotZonePk: string]: number;
  } | null;
  latestHotZonesFetchTimestamp: number;
  latestReportsNearDeviceFetchTimestamp: number;
  latestReportsNearDeviceNotificationTimestamp: number;
  latestReportsNearPoiFetchTimestamp: number;
  latestReportsNearPoiNotificationTimestamp: number;
  localeCode: LocaleCode;
  newReportsNearDeviceNotificationsEnabled: boolean;
  newReportsNearPoiNotificationsEnabled: boolean;
  onboardingCompleted: boolean;
  p2pEnabled: boolean;
  uninstallApplicationEnabled: boolean;
};

export type AppLocaleInfo = {
  dateTimeFormatter: Intl.DateTimeFormat;
  direction: "ltr" | "rtl";
  localeCode: "en" | "fa";
};

export type AppSnackbarInfo = {
  css?: SerializedStyles;
  duration?: number;
  message: string;
  timestamp: number;
  type: "warning" | "success" | "error";
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type LatLngAndZoom = LatLng & {
  zoom: number;
};

/**
 * FAQs page content.
 *
 * Possible values:
 *
 * - `undefined`: Loading (initial value)
 * - `null`: Error
 * - `object`: Loaded content
 */
export type FaqsPageContent = GqlFaqsPage | null | undefined;

/**
 * Know Your Rights page content.
 *
 * Possible values:
 *
 * - `undefined`: Loading (initial value)
 * - `null`: Error
 * - `object`: Loaded content
 */
export type KnowYourRightsPageContent =
  | GqlKnowYourRightsPage
  | null
  | undefined;

/**
 * Queue of AppSnackbarInfo. Has three possible lengths:
 *
 * 0. `[]`: No items displayed. Will transition to `1` if `snackbarQueued`
 *    called.
 * 1. `[AppSnackbarInfo]`: Item is displayed. Will transition to `0` on
 *    `snackbarExited`, or to `2` if `snackbarQueued` called before item exits.
 * 2. `[AppSnackbarInfo, AppSnackbarInfo]`: First item is displayed but exiting,
 *    second item queued to display. Will transition to `1` once first item
 *    exits.
 *
 * Will never have a length greater than 2. If `snackbarQueued` called when
 * there are 2 items the new item will replace the second item.
 */
type AppSnackbarQueue =
  | [AppSnackbarInfo, AppSnackbarInfo]
  | [AppSnackbarInfo]
  | [];

// OverlayScrollbarsComponent is used in Android to create scrollbar
type AppOverlayScrollbarsComponent = typeof OverlayScrollbarsComponent | null;

type LatLngString = `${string},${string}`;

export type ReportGroupsByLatLngString = Map<LatLngString, GqlReportGroup>;

type BackgroundGeolocationTrackingState =
  | "disabled"
  | "enabled"
  | "ready"
  | "startRequested" // Start has been requested but onProviderChange hasn’t fired
  | "stopRequested"; // Stop has been requested but onProviderChange hasn’t fired

export type AppState = {
  OverlayScrollbarsComponent?: typeof OverlayScrollbarsComponent | null;
  appIsActive: boolean | undefined;
  /**
   * State of the BackgroundGeolocation provider, including data about the
   * device’s location services status and permissions.
   *
   * (Friendly derived format of `backgroundGeolocationProviderState`, defined
   * without enums so it’s easier to work with.)
   */
  backgroundGeolocationProviderState: BackgroundGeolocationProviderState;
  /**
   * Status of BackgroundGeolocation tracking.
   */
  backgroundGeolocationTrackingState:
    | undefined
    | BackgroundGeolocationTrackingState;
  connectionStatus: ConnectionStatus;
  deviceIsMoving: boolean;
  deviceLatLng: LatLng | null;
  deviceLatLngUpdateCompleteTime: number | null;
  deviceLatLngUpdateRequestTime: number | null;
  faqsPageContent: FaqsPageContent;
  googleMapsApiState: "loading" | "loaded" | "failed";
  hotzones: Array<GqlHotZoneCluster>;
  knowYourRightsPageContent: KnowYourRightsPageContent;
  localNotificationsPermissionState: CapacitorPermissionState;
  localeInfo: AppLocaleInfo;
  mapHasBeenCenteredOnDeviceLatLng: boolean;
  mapLatLngAndZoom: LatLngAndZoom;
  menuDrawerIsOpen: boolean;
  motionPermissionState: CapacitorPermissionState;
  pointsOfInterest: Array<GqlPointOfInterest>;
  preferences: AppPreferences;
  reportGroupHasBeenDisplayedAtCurrentMapLatLng: boolean;
  reportGroups: Array<GqlReportGroup>;
  reportsRefetchRequestTimestamp: number;
  snackbarIsOpen: boolean;
  snackbarQueue: AppSnackbarQueue;
  strings: Strings;
  userReports: Array<GqlReport>;
  userToken: string;
};

// Add actions here:
export type AppAction =
  | {
      type: "backgroundGeolocationDisabled";
    }
  | {
      type: "backgroundGeolocationEnabled";
    }
  | {
      type: "backgroundGeolocationReadied";
    }
  | {
      type: "backgroundGeolocationStartRequested";
    }
  | {
      type: "backgroundGeolocationStopRequested";
    }
  | {
      backgroundGeolocationState: BackgroundGeolocationTrackingState;
      type: "backgroundGeolocationStatusResolved";
    }
  | {
      backgroundGeolocationProviderState: BackgroundGeolocationProviderState;
      type: "backgroundGeolocationProviderStateChanged";
    }
  | {
      connectionStatus: ConnectionStatus;
      type: "connectionStatusChanged";
    }
  | {
      localNotificationsPermissionState: CapacitorPermissionState;
      type: "localNotificationsPermissionStateChanged";
    }
  | {
      motionPermissionState: CapacitorPermissionState;
      type: "motionPermissionStateChanged";
    }
  | {
      hotzones: Array<GqlHotZoneCluster>;
      type: "updateHotZones";
    }
  | {
      type: "userReportsLoaded";
      userReportedReports: Array<GqlReport>;
    }
  | { type: "reportGroupDisplayedAtCurrentMapLatLng" }
  | {
      reportGroups: Array<GqlReportGroup>;
      type: "reportGroupsLoaded";
    }
  | { type: "reportsRefetchRequested" }
  | {
      duration?: number;
      messageStringKey: StringKey;
      messageType: AppSnackbarInfo["type"];
      offsetElement?: HTMLElement | null;
      type: "snackbarQueued";
    }
  | { type: "snackbarClosed" }
  | { type: "snackbarExited" }
  | { type: "openMenuDrawer" }
  | { type: "closeMenuDrawer" }
  | {
      state: "loading" | "loaded" | "failed";
      type: "googleMapsApiStateUpdated";
    }
  | {
      OverlayScrollbarsComponent: AppOverlayScrollbarsComponent;
      type: "overlayScrollbarsComponentUpdated";
    }
  | {
      /**
       * Preferences to update (other preferences will be left untouched).
       */
      preferences: Partial<AppPreferences>;
      type: "updatePreferences";
    }
  | {
      /**
       * Preferences to update (other preferences will be left untouched).
       */
      pointsOfInterest: Array<GqlPointOfInterest>;
      type: "updatePointsOfInterest";
    }
  | {
      /**
       * Preferences to update (other preferences will be left untouched).
       */
      pointOfInterest: GqlPointOfInterest;
      type: "removePointOfInterest";
    }
  | {
      knowYourRightsPage: GqlKnowYourRightsPage | null;
      type: "knowYourRightsPageLoaded";
    }
  | {
      faqsPage: GqlFaqsPage | null;
      type: "faqsPageLoaded";
    }
  | {
      deviceIsMoving: boolean;
      type: "deviceIsMovingChanged";
    }
  | {
      lat: number;
      lng: number;
      /**
       * This should only be set to false for simulated locations.
       */
      shouldBeOffset?: boolean;
      type: "deviceLatLngChanged";
    }
  // TODO: Remove deviceLatLngUpdateFailed and deviceLatLngUpdateRequested later
  // if we’re confident relying purely on BackgroundGeolocation.watchPosition
  // and Geolocation.watchPosition
  | {
      type: "deviceLatLngUpdateFailed";
    }
  | {
      type: "deviceLatLngUpdateRequested";
    }
  | {
      lat?: number;
      lng?: number;
      type: "mapLatLngAndZoomChanged";
      zoom?: number;
    }
  | {
      type: "mapCenteredOnDeviceLatLng";
    }
  | {
      type: "appBecameActive";
    }
  | {
      type: "appBecameInactive";
    }
  | {
      isActive: boolean;
      type: "appIsActiveStateResolved";
    };

// ===============
// === Reducer ===
// ===============

const appReducer = (state: AppState, action: AppAction) => {
  const newState = match<AppAction, AppState>(action)
    .with(
      { type: "backgroundGeolocationProviderStateChanged" },
      ({ backgroundGeolocationProviderState }) => ({
        ...state,
        // Note: In this match() we need to manually specify the enum numbers
        // because capacitor-background-geolocation’s enum exports aren’t typed
        // specifically (e.g.
        // `BackgroundGeolocation.AUTHORIZATION_STATUS_NOT_DETERMINED` has type
        // `AuthorizationStatus`, not `0`)
        backgroundGeolocationProviderState,
      }),
    )
    .with({ type: "backgroundGeolocationDisabled" }, () => ({
      ...state,
      backgroundGeolocationTrackingState: "disabled",
    }))
    .with({ type: "backgroundGeolocationEnabled" }, () => ({
      ...state,
      backgroundGeolocationTrackingState: "enabled",
    }))
    .with({ type: "backgroundGeolocationReadied" }, () => ({
      ...state,
      backgroundGeolocationTrackingState: "ready",
    }))
    .with(
      { type: "backgroundGeolocationStatusResolved" },
      ({ backgroundGeolocationState }) => ({
        ...state,
        backgroundGeolocationTrackingState: backgroundGeolocationState,
      }),
    )
    .with({ type: "backgroundGeolocationStartRequested" }, () => ({
      ...state,
      backgroundGeolocationTrackingState: "startRequested",
    }))
    .with({ type: "backgroundGeolocationStopRequested" }, () => ({
      ...state,
      backgroundGeolocationTrackingState: "stopRequested",
    }))
    .with({ type: "connectionStatusChanged" }, ({ connectionStatus }) => ({
      ...state,
      connectionStatus,
    }))
    .with(
      { type: "localNotificationsPermissionStateChanged" },
      ({ localNotificationsPermissionState }) => ({
        ...state,
        localNotificationsPermissionState,
      }),
    )
    .with(
      { type: "motionPermissionStateChanged" },
      ({ motionPermissionState }) => ({
        ...state,
        motionPermissionState,
      }),
    )
    .with({ type: "snackbarQueued" }, (action) => {
      const snackbarCss = match(action.offsetElement)
        .with(P.instanceOf(HTMLElement), (offsetElement) => {
          const offsetElementDomRect = offsetElement.getBoundingClientRect();

          return css({
            bottom: `calc(${
              document.body.offsetHeight - offsetElementDomRect.top
            }px + 1rem) !important`,
          });
        })
        .otherwise(() => undefined);

      const activeSnackbarInfo = state.snackbarQueue[0];

      const message = getStringByDotSeparatedKey({
        dotSeparatedKey: action.messageStringKey,
        strings: state.strings,
      });

      const newSnackbarInfo = {
        css: snackbarCss,
        duration: action.duration ?? 2000,
        message,
        timestamp: Date.now(),
        type: action.messageType,
      };

      const snackbarQueue: AppSnackbarQueue = activeSnackbarInfo
        ? [activeSnackbarInfo, newSnackbarInfo]
        : [newSnackbarInfo];

      const snackbarIsOpen = state.snackbarIsOpen
        ? snackbarQueue.length === 2
          ? false
          : true
        : true;

      return {
        ...state,
        snackbarIsOpen,
        snackbarQueue,
      };
    })
    .with({ type: "snackbarClosed" }, () => ({
      ...state,
      snackbarIsOpen: false,
    }))
    .with({ type: "snackbarExited" }, () => {
      const snackbarQueue: AppSnackbarQueue = state.snackbarQueue[1]
        ? [state.snackbarQueue[1]]
        : [];

      return {
        ...state,
        snackbarIsOpen: snackbarQueue.length > 0,
        snackbarQueue,
      };
    })
    .with({ type: "closeMenuDrawer" }, () => ({
      ...state,
      menuDrawerIsOpen: false,
    }))
    .with({ type: "openMenuDrawer" }, () => ({
      ...state,
      menuDrawerIsOpen: true,
    }))
    .with({ type: "reportGroupDisplayedAtCurrentMapLatLng" }, () => ({
      ...state,
      reportGroupHasBeenDisplayedAtCurrentMapLatLng: true,
    }))
    .with({ type: "reportGroupsLoaded" }, (action) => ({
      ...state,
      reportGroups: action.reportGroups,
    }))
    .with({ type: "reportsRefetchRequested" }, () => ({
      ...state,
      reportsRefetchRequestTimestamp: Date.now(),
    }))
    .with({ type: "userReportsLoaded" }, ({ userReportedReports }) => ({
      ...state,
      userReports: userReportedReports,
    }))
    .with({ type: "updateHotZones" }, (action) => ({
      ...state,
      hotzones: action.hotzones,
    }))
    .with({ type: "updatePreferences" }, (action) => {
      const newPreferences = {
        ...state.preferences,
        ...action.preferences,
      };

      Preferences.set({
        key: capacitorPreferencesKeys.appPreferences,
        value: JSON.stringify(newPreferences),
      }).catch(() => {
        console.error(
          "[appStore updatePreferences] Failed to write preferences",
        );
      });

      const newLocaleInfo: AppLocaleInfo = {
        ...state.localeInfo,
        direction: newPreferences.localeCode === "en" ? "ltr" : "rtl",
        localeCode: newPreferences.localeCode,
      };

      updateDocumentLocaleAttributes(newPreferences.localeCode);

      return {
        ...state,
        localeInfo: newLocaleInfo,
        preferences: newPreferences,
        strings: newPreferences.localeCode === "en" ? stringsEn : stringsFa,
      };
    })

    .with({ type: "updatePointsOfInterest" }, (action) => ({
      ...state,
      pointsOfInterest: action.pointsOfInterest,
    }))
    .with({ type: "removePointOfInterest" }, (action) => {
      const newPointsOfInterest = state.pointsOfInterest.filter(
        (point) => point.id !== action.pointOfInterest.id,
      );

      return {
        ...state,
        pointsOfInterest: newPointsOfInterest,
      };
    })
    .with(
      { type: "googleMapsApiStateUpdated" },
      ({ state: googleMapsApiState }) => ({
        ...state,
        googleMapsApiState,
      }),
    )
    .with(
      { type: "overlayScrollbarsComponentUpdated" },
      ({ OverlayScrollbarsComponent }) => ({
        ...state,
        OverlayScrollbarsComponent,
      }),
    )
    .with({ type: "knowYourRightsPageLoaded" }, (action) => ({
      ...state,
      knowYourRightsPageContent: action.knowYourRightsPage
        ? {
            chapters: (action.knowYourRightsPage.chapters || []).reduce(
              (acc, edge) => (edge ? [...acc, edge] : acc),
              [],
            ),
            title: action.knowYourRightsPage.title,
          }
        : null,
    }))
    .with({ type: "faqsPageLoaded" }, (action) => ({
      ...state,
      faqsPageContent: action.faqsPage
        ? {
            faqTitle: action.faqsPage.faqTitle,
            faqTopics: (action.faqsPage.faqTopics || []).reduce(
              (acc, edge) => (edge ? [...acc, edge] : acc),
              [],
            ),
          }
        : null,
    }))
    .with({ type: "deviceIsMovingChanged" }, ({ deviceIsMoving }) => ({
      ...state,
      deviceIsMoving,
    }))
    .with(
      { type: "deviceLatLngChanged" },
      ({ lat, lng, shouldBeOffset = true }) => ({
        ...state,
        deviceLatLng: shouldBeOffset
          ? offsetLatLng({ lat, lng })
          : { lat, lng },
        deviceLatLngUpdateCompleteTime: Date.now(),
      }),
    )
    .with({ type: "deviceLatLngUpdateFailed" }, () => ({
      ...state,
      deviceLatLngUpdateCompleteTime: Date.now(),
    }))
    .with({ type: "deviceLatLngUpdateRequested" }, () => ({
      ...state,
      deviceLatLngUpdateRequestTime: Date.now(),
    }))
    .with({ type: "mapLatLngAndZoomChanged" }, (action) => {
      // Don’t mutate state if provided values are the same as existing values
      // (to prevent render loops in some cases)
      if (
        (!action.lat || action.lat === state.mapLatLngAndZoom.lat) &&
        (!action.lng || action.lng === state.mapLatLngAndZoom.lng) &&
        (!action.zoom || action.zoom === state.mapLatLngAndZoom.zoom)
      ) {
        return state;
      }

      return {
        ...state,
        mapLatLngAndZoom: {
          lat: action.lat ?? state.mapLatLngAndZoom.lat,
          lng: action.lng ?? state.mapLatLngAndZoom.lng,
          zoom: action.zoom ?? state.mapLatLngAndZoom.zoom,
        },
        reportGroupHasBeenDisplayedAtCurrentMapLatLng: false,
        reportsRefetchRequestTimestamp: Date.now(),
      };
    })
    .with({ type: "mapCenteredOnDeviceLatLng" }, () => ({
      ...state,
      mapHasBeenCenteredOnDeviceLatLng: true,
    }))
    .with({ type: "appBecameActive" }, () => ({
      ...state,
      appIsActive: true,
    }))
    .with({ type: "appBecameInactive" }, () => ({
      ...state,
      appIsActive: false,
    }))
    .with({ type: "appIsActiveStateResolved" }, ({ isActive }) => ({
      ...state,
      appIsActive: isActive,
    }))
    .exhaustive();

  reducerLog({
    action,
    newState,
    state,
    storeName: "app",
  });

  return newState;
};

const useApp = ({ initialState }: { initialState: AppState }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return { dispatch, state };
};

export const [
  AppProvider,
  useAppDispatch,
  useAppConnectionStatus,
  useAppCurrentSnackbarInfo,
  useAppSnackbarIsOpen,
  useAppLocaleInfo,
  useAppMenuDrawerIsOpen,
  useAppStrings,
  useAppUserToken,
  useAppMapHasBeenCenteredOnDeviceLatLng,
  useAppMapLatLngAndZoom,
  useAppReportGroupHasBeenDisplayedAtCurrentMapLatLng,
  useAppReportGroups,
  useAppPointOfInterests,
  useAppGoogleMapsApiState,
  useAppOverlayScrollbarsComponent,
  useAppKnowYourRightsPageContent,
  useAppFaqsPageContent,
  useAppBackgroundGeolocationProviderState,
  useAppBackgroundGeolocationTrackingState,
  useAppDeviceIsMoving,
  useAppIsActive,
  useAppHotzones,
  useAppDeviceLatLng,
  useAppDeviceLatLngUpdateRequestTime,
  useAppLocalNotificationsPermissionState,
  useAppMotionPermissionState,
  useAppPreferences,
  useAppPreferencesBackgroundGeolocationEnabled,
  useAppPreferencesDeviceInsideHotZonePks,
  useAppPreferencesHotZoneEnteredNotificationsEnabled,
  useAppPreferencesLatestHotZoneEnteredNotificationTimestamps,
  useAppPreferencesLatestHotZonesFetchTimestamp,
  useAppPreferencesLatestReportsNearDeviceFetchTimestamp,
  useAppPreferencesLatestReportsNearDeviceNotificationTimestamp,
  useAppPreferencesLatestReportsNearPoiFetchTimestamp,
  useAppPreferencesLatestReportsNearPoiNotificationTimestamp,
  useAppPreferencesNewReportsNearDeviceNotificationsEnabled,
  useAppPreferencesNewReportsNearPoiNotificationsEnabled,
  useAppPreferencesOnboardingCompleted,
  useAppPreferencesP2pEnabled,
  useAppPreferencesUninstallApplicationEnabled,
  useAppReportsRefetchRequestTimestamp,
  useAppUserReports,
] = constate(
  useApp,
  (value) => value.dispatch,
  (value) => value.state.connectionStatus,
  (value) =>
    value.state.snackbarQueue[0] ? value.state.snackbarQueue[0] : null,
  (value) => value.state.snackbarIsOpen,
  (value) => value.state.localeInfo,
  (value) => value.state.menuDrawerIsOpen,
  (value) => value.state.strings,
  (value) => value.state.userToken,
  (value) => value.state.mapHasBeenCenteredOnDeviceLatLng,
  (value) => value.state.mapLatLngAndZoom,
  (value) => value.state.reportGroupHasBeenDisplayedAtCurrentMapLatLng,
  (value) => value.state.reportGroups,
  (value) => value.state.pointsOfInterest,
  (value) => value.state.googleMapsApiState,
  (value) => value.state.OverlayScrollbarsComponent,
  (value) => value.state.knowYourRightsPageContent,
  (value) => value.state.faqsPageContent,
  (value) => value.state.backgroundGeolocationProviderState,
  (value) => value.state.backgroundGeolocationTrackingState,
  (value) => value.state.deviceIsMoving,
  (value) => value.state.appIsActive,
  (value) => value.state.hotzones,
  (value) => value.state.deviceLatLng,
  (value) => value.state.deviceLatLngUpdateRequestTime,
  (value) => value.state.localNotificationsPermissionState,
  (value) => value.state.motionPermissionState,
  (value) => value.state.preferences,
  (value) => value.state.preferences.backgroundGeolocationEnabled,
  (value) => value.state.preferences.deviceInsideHotZonePks,
  (value) => value.state.preferences.hotZoneEnteredNotificationsEnabled,
  (value) => value.state.preferences.latestHotZoneEnteredNotificationTimestamps,
  (value) => value.state.preferences.latestHotZonesFetchTimestamp,
  (value) => value.state.preferences.latestReportsNearDeviceFetchTimestamp,
  (value) =>
    value.state.preferences.latestReportsNearDeviceNotificationTimestamp,
  (value) => value.state.preferences.latestReportsNearPoiFetchTimestamp,
  (value) => value.state.preferences.latestReportsNearPoiNotificationTimestamp,
  (value) => value.state.preferences.newReportsNearDeviceNotificationsEnabled,
  (value) => value.state.preferences.newReportsNearPoiNotificationsEnabled,
  (value) => value.state.preferences.onboardingCompleted,
  (value) => value.state.preferences.p2pEnabled,
  (value) => value.state.preferences.uninstallApplicationEnabled,
  (value) => value.state.reportsRefetchRequestTimestamp,
  (value) => value.state.userReports,
);
