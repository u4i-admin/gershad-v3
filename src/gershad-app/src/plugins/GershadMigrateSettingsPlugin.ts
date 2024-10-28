import { registerPlugin } from "@capacitor/core";

type GershadMigrateSettingsPlugin = {
  migrateSettings(): Promise<{
    enableNotificationsNearYou: boolean;
    enableNotificationsNearYourSavedLocation: boolean;
    /**
     * We don’t use this since the new app doesn’t currently have a setting to
     * disable the uninstall feature.
     */
    enableUninstallFeature: boolean;
  }>;
};

const androidGershadMigrateSettingsPlugin: GershadMigrateSettingsPlugin =
  registerPlugin<GershadMigrateSettingsPlugin>("GershadMigrateSettingsPlugin");

/**
 * Should this plugin be mocked?
 *
 * TODO: Replace with import.meta.env.VITE_BUILD_TYPE === "mock"
 */
const enableMock = false;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockAndroidGershadMigrateSettingsPlugin: GershadMigrateSettingsPlugin = {
  migrateSettings: async () => ({
    enableNotificationsNearYou: true,
    enableNotificationsNearYourSavedLocation: true,
    enableUninstallFeature: true,
  }),
};

const GershadMigrateSettingsPlugin = enableMock
  ? mockAndroidGershadMigrateSettingsPlugin
  : androidGershadMigrateSettingsPlugin;

export default GershadMigrateSettingsPlugin;
