import { Capacitor } from "@capacitor/core";
import { match } from "ts-pattern";

const capacitorPreferenceKeyPrefix = "gershad";

export const capacitorPreferencesKeys = {
  appPreferences: `${capacitorPreferenceKeyPrefix}AppPreferences`,
  cognitoIdentityId: `${capacitorPreferenceKeyPrefix}CognitoIdentityId`,
  initialPath: `${capacitorPreferenceKeyPrefix}InitialPath`,
};

export const isNativePlatform = Capacitor.isNativePlatform();

export const platform: "android" | "ios" | "web" = match(
  Capacitor.getPlatform(),
)
  .with("android", "ios", (platform) => platform)
  .otherwise(() => "web");

export const mapZoomLevels = {
  /**
   * Default zoom level.
   */
  default: 12,
  /**
   * Zoom level when focussing on a location (e.g. point of interest or report).
   */
  locationFocussed: 16,
  /**
   * Zoom level when map initially centers on device lat/lng.
   */
  mapCenteredOnDeviceLatLng: 14,
} as const;
