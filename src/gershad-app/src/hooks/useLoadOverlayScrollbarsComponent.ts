import { Device } from "@capacitor/device";
import { useEffect } from "react";

import { useAppDispatch } from "src/stores/appStore";

/**
 * Load `overlayscrollbars-react` `OverlayScrollbarsComponent` on Android since
 * Android WebView forcibly hides all native scroll bars. On iOS and web it’s a
 * better UX (and slightly better for performance) to use the native scroll bars.
 *
 * Even if this issue is fixed in a future Android version we need to keep this
 * fix for a long time to account for older OS/WebView versions. See:
 *
 * - https://bugs.chromium.org/p/chromium/issues/detail?id=1327047
 * - https://github.com/ionic-team/capacitor/issues/5540#issuecomment-1129946846
 */
const useLoadOverlayScrollbarsComponent = () => {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const loadOverlayScrollBarsComponentOnAndroid = async () => {
      const deviceInfo = await Device.getInfo();

      if (deviceInfo.platform !== "android") {
        appDispatch({
          OverlayScrollbarsComponent: null,
          type: "overlayScrollbarsComponentUpdated",
        });
        return;
      }

      const OverlayScrollbarsComponent = (
        await import("overlayscrollbars-react")
      ).OverlayScrollbarsComponent;

      appDispatch({
        OverlayScrollbarsComponent,
        type: "overlayScrollbarsComponentUpdated",
      });
    };

    loadOverlayScrollBarsComponentOnAndroid();
  }, [appDispatch]);
};

export default useLoadOverlayScrollbarsComponent;
