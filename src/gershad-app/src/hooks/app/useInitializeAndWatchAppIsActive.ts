import { App } from "@capacitor/app";
import { PluginListenerHandle } from "@capacitor/core";
import { useEffect, useRef } from "react";

import { useAppDispatch } from "src/stores/appStore";

const useInitializeAndWatchAppIsActive = () => {
  const dispatch = useAppDispatch();
  const appListenerRef = useRef<PluginListenerHandle>();

  const hasRunGetAndDispatchInitialAppIsActiveRef = useRef(false);

  // There may be scenarios where the app starts in an inactive state so we set
  // appIsActive to undefined by default then imperatively check on startup
  useEffect(() => {
    const getAndDispatchInitialAppIsActive = async () => {
      hasRunGetAndDispatchInitialAppIsActiveRef.current = true;

      const appState = await App.getState();

      dispatch({
        isActive: appState.isActive,
        type: "appIsActiveStateResolved",
      });
    };

    if (!hasRunGetAndDispatchInitialAppIsActiveRef.current) {
      getAndDispatchInitialAppIsActive();
    }
  }, [dispatch]);

  useEffect(() => {
    App.addListener("appStateChange", ({ isActive }) => {
      dispatch({ type: isActive ? "appBecameActive" : "appBecameInactive" });
    })
      .then((listener) => {
        appListenerRef.current = listener;
      })
      .catch((error) => {
        console.error("Failed to listen appStateChange event:", error);
      });

    return () => {
      appListenerRef.current
        ?.remove()
        .then(() => {
          console.info(
            "[useInitializeAndWatchAppIsActive]: successfully remove appStateChange listener",
          );
        })
        .catch((error) => {
          console.error(
            "[useInitializeAndWatchAppIsActive]: failed remove appStateChange listener ",
            error,
          );
        });
    };
  }, [dispatch]);
};

export default useInitializeAndWatchAppIsActive;
