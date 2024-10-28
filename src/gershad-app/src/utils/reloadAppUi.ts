import { Preferences } from "@capacitor/preferences";

import { capacitorPreferencesKeys } from "src/values/appValues";

/**
 * Reload the app UI, navigating to the provided `initialPath` on startup (see
 * `useInitialPathAndDeepLinkRouting`).
 *
 * Note that if the `onboardingStage` preference isn’t set to `"complete"`
 * `useInitialPathAndDeepLinkRouting` will always navigate the onboarding route
 * on startup.
 *
 * This is used to reload the UI on locale change since we need to boot with
 * `stylis-plugin-rtl` added or removed from the Emotion cache, and this can’t
 * be changed dynamically.
 */
const reloadAppUi = async ({ initialPath }: { initialPath: string }) => {
  if (initialPath) {
    await Preferences.set({
      key: capacitorPreferencesKeys.initialPath,
      value: initialPath,
    });
  }

  // Regardless of what we set window.location.href to the native apps will
  // reload to HomePage, so we do the same for browser development for
  // consistency.
  window.location.href = "/";
};

export default reloadAppUi;
