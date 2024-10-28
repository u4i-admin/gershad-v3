import { App, URLOpenListenerEvent } from "@capacitor/app";
import { PluginListenerHandle } from "@capacitor/core/types/definitions";
import { Preferences } from "@capacitor/preferences";
import { SplashScreen } from "@capacitor/splash-screen";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { match, P } from "ts-pattern";

import useUpdateMapPositionAndNavigateToHome from "src/hooks/useUpdateMapPositionAndNavigateToHome";
import routeUrls from "src/routeUrls";
import { RouterEventHandler } from "src/types/nextTypes";
import { capacitorPreferencesKeys, mapZoomLevels } from "src/values/appValues";

/**
 * `localStorage` `initialPath` and Capacitor deep link handling.
 */
const useInitialPathAndDeepLinkRouting = () => {
  const router = useRouter();

  const updateMapPositionAndNavigateToHome =
    useUpdateMapPositionAndNavigateToHome();

  const appListenerRef = useRef<PluginListenerHandle>();

  /**
   * Has `incomingInitialPath` been set? (we use this ref to avoid calling
   * initializeIncomingInitialPath twice in development with React Strict Mode
   * enabled)
   */
  const hasInitializedIncomingInitialPath = useRef(false);

  // (See return value for documentation)
  const [incomingInitialPath, setIncomingInitialPath] = useState<
    undefined | null | string
  >();

  // Set incomingInitialPath and push new route if needed
  useEffect(() => {
    if (hasInitializedIncomingInitialPath.current) {
      return;
    }

    const initializeIncomingInitialPath = async () => {
      const launchUrl = await App.getLaunchUrl();

      const { value: localStorageInitialPath } = await Preferences.get({
        key: capacitorPreferencesKeys.initialPath,
      });

      const incomingInitialPath = launchUrl?.url || localStorageInitialPath;

      if (incomingInitialPath) {
        router.push(incomingInitialPath);
      }

      // This will either set incomingInitialPath to string (which will cause
      // _app to continue to render null), or null (which will cause _app to
      // render the current route).
      //
      // If set to string the below onRouteChangeComplete handler will set
      // incomingInitialPath to null later.
      setIncomingInitialPath(incomingInitialPath);

      await Preferences.remove({ key: capacitorPreferencesKeys.initialPath });
    };

    initializeIncomingInitialPath();

    hasInitializedIncomingInitialPath.current = true;
  }, [router]);

  // Set incomingInitialPath to null and hide the native splash screen once
  // route change is complete.
  //
  // Without this the user could briefly see HomePage as the app started, and
  // the app would waste resources rendering HomePage before immediately
  // switching to incomingInitialPath.
  //
  // Note that HomePage’s MainServer also calls SplashScreen.hide() once
  // countryInfos is set (this is a special case since HomePage loads in
  // stages).
  useEffect(() => {
    const onRouteChangeComplete: RouterEventHandler = (url) => {
      if (url === incomingInitialPath) {
        setIncomingInitialPath(null);
        SplashScreen.hide();
      }
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [incomingInitialPath, router.events]);

  // Handle deep links (NOT TESTED YET!)
  // https://capacitorjs.com/docs/guides/deep-links#react
  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      console.info(
        "[useInitialPathAndDeepLinkRouting] Received appUrlOpen:",
        event,
      );

      const url = new URL(event.url);

      const permalinkLatLng = match(
        // @ts-expect-error (all targeted browsers support named capture
        // groups but we can’t change Next.js compiler’s internal ES target)
        /\/(?<lat>[\d.]+),(?<lng>[\d.]+)/.exec(url.pathname)?.groups,
      )
        .with({ lat: P.string, lng: P.string }, ({ lat, lng }) => ({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        }))
        .otherwise(() => null);

      if (permalinkLatLng) {
        updateMapPositionAndNavigateToHome({
          lat: permalinkLatLng.lat,
          lng: permalinkLatLng.lng,
          zoom: mapZoomLevels.locationFocussed,
        });
      } else {
        router.push(routeUrls.home());
      }
    })
      .then((listener) => {
        appListenerRef.current = listener;
      })
      .catch((error) => {
        console.error(
          "[useInitialPathAndDeepLinkRouting] Error in appUrlOpen handler:",
          error,
        );
      });

    return () => {
      appListenerRef.current
        ?.remove()
        .then(() => {
          console.info(
            "[useInitialPathAndDeepLinkRouting]: successfully remove appUrlOpen listener",
          );
        })
        .catch((error) => {
          console.error(
            "[useInitialPathAndDeepLinkRouting]: failed remove appUrlOpen listener ",
            error,
          );
        });
    };
  }, [router, updateMapPositionAndNavigateToHome]);

  return {
    /**
     * Possible values:
     *
     * - `undefined`: Hasn’t determined if there will be an incoming initial
     *   path (because `getIncomingInitialPath` is asynchronous)
     * - `null`: There’s no incoming initial path (or there was but it’s been
     *   navigated to)
     * - `string`: There’s an incoming initial path
     */
    incomingInitialPath,
  };
};

export default useInitialPathAndDeepLinkRouting;
