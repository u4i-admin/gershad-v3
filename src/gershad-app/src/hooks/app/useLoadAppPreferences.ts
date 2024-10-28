import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { useEffect, useState } from "react";
import { match, P } from "ts-pattern";

import GershadMigrateSettingsPlugin from "src/plugins/GershadMigrateSettingsPlugin";
import { AppPreferences } from "src/stores/appStore";
import { capacitorPreferencesKeys } from "src/values/appValues";

export const defaultPreferences: AppPreferences = {
  backgroundGeolocationEnabled: false,
  deviceInsideHotZonePks: [],
  hotZoneEnteredNotificationsEnabled: false,
  latestHotZoneEnteredNotificationTimestamps: null,
  latestHotZonesFetchTimestamp: Date.now(),
  latestReportsNearDeviceFetchTimestamp: Date.now(),
  latestReportsNearDeviceNotificationTimestamp: Date.now(),
  latestReportsNearPoiFetchTimestamp: Date.now(),
  latestReportsNearPoiNotificationTimestamp: Date.now(),
  localeCode: "fa",
  newReportsNearDeviceNotificationsEnabled: false,
  newReportsNearPoiNotificationsEnabled: false,
  onboardingCompleted: false,
  p2pEnabled: false,
  uninstallApplicationEnabled: false,
};

/**
 * `AppPreferences`, but with optional and `unknown` values.
 */
type StoredAppPreferences = {
  [Key in keyof AppPreferences]?: unknown;
};

/**
 * Parse the provided preferences string, returning `StoredAppPreferences` (even
 * if the provided `rawStoredAppPreferences` is unparsable).
 */
const parseRawStoredAppPreferences = (
  rawStoredAppPreferences: string,
): StoredAppPreferences => {
  try {
    const parsedStoredAppPreferences = JSON.parse(rawStoredAppPreferences);

    // Via https://stackoverflow.com/a/43773857
    return Object.getPrototypeOf(parsedStoredAppPreferences) ===
      Object.prototype
      ? parsedStoredAppPreferences
      : {};
  } catch {
    return {};
  }
};

/**
 * Converts `StoredAppPreferences` to `AppPreferences` by replacing any missing
 * or invalid values with `defaultPreferences` values.
 */
const normalizeStoredAppPreferences = (
  storedAppPreferences: StoredAppPreferences,
): AppPreferences => ({
  backgroundGeolocationEnabled: match(
    storedAppPreferences.backgroundGeolocationEnabled,
  )
    .with(P.boolean, (booleanValue) => booleanValue)
    .otherwise(() => defaultPreferences.backgroundGeolocationEnabled),

  deviceInsideHotZonePks: match(storedAppPreferences.deviceInsideHotZonePks)
    .with(P.array(P.number), (arrayValue) => arrayValue)
    .otherwise(() => defaultPreferences.deviceInsideHotZonePks),

  hotZoneEnteredNotificationsEnabled: match(
    storedAppPreferences.hotZoneEnteredNotificationsEnabled,
  )
    .with(P.boolean, (booleanValue) => booleanValue)
    .otherwise(() => defaultPreferences.hotZoneEnteredNotificationsEnabled),

  latestHotZoneEnteredNotificationTimestamps: match(
    storedAppPreferences.latestHotZoneEnteredNotificationTimestamps,
  )
    .with({}, (value) => value)
    .otherwise(
      () => defaultPreferences.latestHotZoneEnteredNotificationTimestamps,
    ),

  latestHotZonesFetchTimestamp: match(
    storedAppPreferences.latestHotZonesFetchTimestamp,
  )
    .with(P.number, (numberValue) => numberValue)
    .otherwise(() => defaultPreferences.latestHotZonesFetchTimestamp),

  latestReportsNearDeviceFetchTimestamp: match(
    storedAppPreferences.latestReportsNearDeviceFetchTimestamp,
  )
    .with(P.number, (numberValue) => numberValue)
    .otherwise(() => defaultPreferences.latestReportsNearDeviceFetchTimestamp),

  latestReportsNearDeviceNotificationTimestamp: match(
    storedAppPreferences.newReportsNearDeviceNotificationsEnabled,
  )
    .with(P.number, (numberValue) => numberValue)
    .otherwise(
      () => defaultPreferences.latestReportsNearDeviceNotificationTimestamp,
    ),

  latestReportsNearPoiFetchTimestamp: match(
    storedAppPreferences.latestReportsNearPoiFetchTimestamp,
  )
    .with(P.number, (numberValue) => numberValue)
    .otherwise(() => defaultPreferences.latestReportsNearPoiFetchTimestamp),

  latestReportsNearPoiNotificationTimestamp: match(
    storedAppPreferences.latestReportsNearPoiNotificationTimestamp,
  )
    .with(P.number, (numberValue) => numberValue)
    .otherwise(
      () => defaultPreferences.latestReportsNearPoiNotificationTimestamp,
    ),

  localeCode: match(storedAppPreferences.localeCode)
    .with("en", "fa", (localeCode) => localeCode)
    .otherwise(() => defaultPreferences.localeCode),

  newReportsNearDeviceNotificationsEnabled: match(
    storedAppPreferences.newReportsNearDeviceNotificationsEnabled,
  )
    .with(P.boolean, (booleanValue) => booleanValue)
    .otherwise(
      () => defaultPreferences.newReportsNearDeviceNotificationsEnabled,
    ),

  newReportsNearPoiNotificationsEnabled: match(
    storedAppPreferences.newReportsNearPoiNotificationsEnabled,
  )
    .with(P.boolean, (booleanValue) => booleanValue)
    .otherwise(() => defaultPreferences.newReportsNearPoiNotificationsEnabled),

  onboardingCompleted: match(storedAppPreferences.onboardingCompleted)
    .with(P.boolean, (booleanValue) => booleanValue)
    .otherwise(() => defaultPreferences.onboardingCompleted),

  p2pEnabled: match(storedAppPreferences.p2pEnabled)
    .with(P.boolean, (booleanValue) => booleanValue)
    .otherwise(() => defaultPreferences.p2pEnabled),

  uninstallApplicationEnabled: match(
    storedAppPreferences.uninstallApplicationEnabled,
  )
    .with(P.boolean, (booleanValue) => booleanValue)
    .otherwise(() => defaultPreferences.uninstallApplicationEnabled),
});

const useLoadAppPreferences = () => {
  const [appPreferences, setAppPreferences] = useState<AppPreferences | null>(
    null,
  );
  // ----------------
  // --- AppStore ---
  // ----------------

  useEffect(() => {
    const getPreferencesValue = async () => {
      const { value: rawStoredAppPreferences } = await Preferences.get({
        key: capacitorPreferencesKeys.appPreferences,
      });

      /**
       * Object that could contain any of `AppPreferences’` keys set to any
       * value.
       *
       * (`parseRawStoredAppPreferences` should return an `AppPreferences`
       * object, but we don’t know know this for sure yet since the value could
       * be corrupted, or we could have changed the structure of
       * `AppPreferences` in an update.)
       */
      const storedAppPreferences: StoredAppPreferences =
        typeof rawStoredAppPreferences === "string"
          ? parseRawStoredAppPreferences(rawStoredAppPreferences)
          : {};

      // Add values loaded using GershadMigrateSettingsPlugin if platform is
      // Android and migratable settings aren’t already set
      const storedAppPreferencesWithMigratedValues: StoredAppPreferences =
        Capacitor.getPlatform() === "android" &&
        (typeof storedAppPreferences.newReportsNearDeviceNotificationsEnabled !==
          "boolean" ||
          typeof storedAppPreferences.newReportsNearPoiNotificationsEnabled !==
            "boolean")
          ? await (async () => {
              try {
                const legacyAppSettings =
                  await GershadMigrateSettingsPlugin.migrateSettings();

                console.info(
                  "[useLoadAppPreferences] Migrated settings using GershadMigrateSettingsPlugin:",
                  legacyAppSettings,
                );

                return {
                  ...storedAppPreferences,
                  newReportsNearDeviceNotificationsEnabled:
                    legacyAppSettings.enableNotificationsNearYou,
                  newReportsNearPoiNotificationsEnabled:
                    legacyAppSettings.enableNotificationsNearYourSavedLocation,
                };
              } catch (error) {
                console.warn(
                  "[useLoadAppPreferences] Attempted to migrate legacy settings with GershadMigrateSettingsPlugin but failed with error:",
                  error,
                );

                return storedAppPreferences;
              }
            })()
          : storedAppPreferences;

      const normalizedAppPreferences = normalizeStoredAppPreferences(
        storedAppPreferencesWithMigratedValues,
      );

      // Uncomment to reset preferences on startup
      // setAppPreferences(defaultPreferences);

      setAppPreferences(normalizedAppPreferences);
    };

    getPreferencesValue();
  }, []);

  return appPreferences;
};

export default useLoadAppPreferences;
