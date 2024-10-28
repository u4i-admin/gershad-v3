import { useRouter } from "next/router";
import { useCallback } from "react";

import routeUrls from "src/routeUrls";
import { useAppDispatch } from "src/stores/appStore";

const useUpdateMapPositionAndNavigateToHome = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const updateMapPositionAndNavigateToHome = useCallback(
    ({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) => {
      dispatch({
        lat,
        lng,
        type: "mapLatLngAndZoomChanged",
        zoom,
      });

      router.push(routeUrls.home());
    },
    [dispatch, router],
  );

  return updateMapPositionAndNavigateToHome;
};

export default useUpdateMapPositionAndNavigateToHome;
