import { useEffect, useRef } from "react";

import {
  useAppDispatch,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";

const useFetchAndDispatchHotzonesOnce = () => {
  const dispatch = useAppDispatch();
  const strings = useAppStrings();
  const userToken = useAppUserToken();

  const hasDispatched = useRef(false);

  useEffect(() => {
    const fetchAndDispatchHotZonesOnce = async () => {
      if (hasDispatched.current) {
        return;
      }

      try {
        const graphQlSdk = await getGraphQlSdk();

        const hotZonesResponse = await graphQlSdk.getHotZones();

        const hotzones = (hotZonesResponse?.hotzones?.edges || []).reduce(
          (acc, edge) => (edge.node ? [...acc, edge.node] : acc),
          [],
        );

        if (!hotzones) {
          dispatch({
            messageStringKey: "shared.toasts.dataLoadFailed",
            messageType: "error",
            type: "snackbarQueued",
          });
        } else {
          dispatch({
            hotzones,
            type: "updateHotZones",
          });

          hasDispatched.current = true;
        }
      } catch (error) {
        console.error(
          "[useFetchAndDispatchHotzonesOnce] Error in fetchAndDispatchHotZonesOnce:",
          error,
        );

        dispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
      }
    };

    fetchAndDispatchHotZonesOnce();
  }, [dispatch, strings, userToken]);
};

export default useFetchAndDispatchHotzonesOnce;
