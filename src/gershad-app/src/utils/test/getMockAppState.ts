import { defaultLatLng } from "src/components/HomePage/GoogleMap/GoogleMap";
import { AppState } from "src/stores/appStore";
import stringsEn from "src/strings/stringsEn";
import stringsFa from "src/strings/stringsFa";
import getLocaleMetadata from "src/utils/getLocaleMetadata";
import { mapZoomLevels } from "src/values/appValues";
import { LocaleCode } from "src/values/localeValues";

const getMockAppState = ({
  localeCode,
}: {
  localeCode: LocaleCode;
}): AppState => ({
  appIsActive: false,
  backgroundGeolocationProviderState: {
    always: true,
    precise: true,
    type: "granted",
  },
  backgroundGeolocationTrackingState: undefined,
  connectionStatus: {
    connected: true,
    connectionType: "wifi",
  },
  deviceIsMoving: false,
  deviceLatLng: defaultLatLng,
  deviceLatLngUpdateCompleteTime: null,
  deviceLatLngUpdateRequestTime: null,
  faqsPageContent: undefined,
  googleMapsApiState: "loaded",
  hotzones: [],
  knowYourRightsPageContent: null,
  localeInfo: getLocaleMetadata(localeCode),
  localNotificationsPermissionState: "granted",
  mapHasBeenCenteredOnDeviceLatLng: false,
  mapLatLngAndZoom: {
    ...defaultLatLng,
    zoom: mapZoomLevels.default,
  },
  menuDrawerIsOpen: false,
  motionPermissionState: "granted",
  OverlayScrollbarsComponent: undefined,
  pointsOfInterest: [],
  preferences: {
    backgroundGeolocationEnabled: false,
    deviceInsideHotZonePks: [],
    hotZoneEnteredNotificationsEnabled: false,
    latestHotZoneEnteredNotificationTimestamps: null,
    latestHotZonesFetchTimestamp: 0,
    latestReportsNearDeviceFetchTimestamp: 0,
    latestReportsNearDeviceNotificationTimestamp: 0,
    latestReportsNearPoiFetchTimestamp: 0,
    latestReportsNearPoiNotificationTimestamp: 0,
    localeCode: "en",
    newReportsNearDeviceNotificationsEnabled: false,
    newReportsNearPoiNotificationsEnabled: false,
    onboardingCompleted: false,
    p2pEnabled: false,
    uninstallApplicationEnabled: false,
  },
  reportGroupHasBeenDisplayedAtCurrentMapLatLng: false,
  reportGroups: [],
  reportsRefetchRequestTimestamp: 0,
  snackbarIsOpen: false,
  snackbarQueue: [],
  strings: localeCode === "en" ? stringsEn : stringsFa,
  userReports: [],
  userToken: "",
});

export default getMockAppState;
