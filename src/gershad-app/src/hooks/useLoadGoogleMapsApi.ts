import { LoadScriptProps, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef } from "react";

import { useAppDispatch, useAppLocaleInfo } from "src/stores/appStore";

const googleMapsLibraries: LoadScriptProps["libraries"] = [
  "geometry",
  "places",
];

const useLoadGoogleMapsApi = () => {
  const { localeCode } = useAppLocaleInfo();
  const appDispatch = useAppDispatch();

  // We need to store this to avoid "Uncaught Error: Loader must not be called
  // again with different options" error thrown by useJsApiLoader when
  // localeCode changes (this only happens momentarily between when appDispatch
  // is called and the UI reloads in changeLocale)
  const initialLocaleCode = useRef(localeCode);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    language: initialLocaleCode.current,
    libraries: googleMapsLibraries,
  });

  useEffect(() => {
    if (loadError) {
      appDispatch({
        state: "failed",
        type: "googleMapsApiStateUpdated",
      });
    }

    if (isLoaded) {
      appDispatch({
        state: "loaded",
        type: "googleMapsApiStateUpdated",
      });
    }
  }, [appDispatch, isLoaded, loadError]);

  return isLoaded;
};

export default useLoadGoogleMapsApi;
