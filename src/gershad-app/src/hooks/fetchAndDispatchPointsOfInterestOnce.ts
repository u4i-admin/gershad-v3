import { useEffect, useRef } from "react";

import {
  useAppDispatch,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";

const useFetchAndDispatchPointsOfInterestOnce = () => {
  const dispatch = useAppDispatch();
  const strings = useAppStrings();
  const userToken = useAppUserToken();

  const hasDispatched = useRef(false);

  useEffect(() => {
    const fetchAndDispatchPointsOfInterestOnce = async () => {
      if (hasDispatched.current) {
        return;
      }

      try {
        const graphQlSdk = await getGraphQlSdk();

        const pointsOfInterestResponse = await graphQlSdk.getPointsOfInterest({
          orderBy: "-created",
          token: userToken,
        });

        const pointsOfInterest = (
          pointsOfInterestResponse?.pointsOfInterest || []
        ).reduce((acc, edge) => (edge ? [...acc, edge] : acc), []);

        if (!pointsOfInterest) {
          dispatch({
            messageStringKey: "shared.toasts.dataLoadFailed",
            messageType: "error",
            type: "snackbarQueued",
          });
        } else {
          dispatch({
            pointsOfInterest,
            type: "updatePointsOfInterest",
          });

          hasDispatched.current = true;
        }
      } catch (error) {
        console.error(
          "[useFetchAndDispatchPointsOfInterestOnce] Error in fetchAndDispatchPointsOfInterestOnce:",
          error,
        );

        dispatch({
          messageStringKey: "shared.toasts.dataLoadFailed",
          messageType: "error",
          type: "snackbarQueued",
        });
      }
    };

    fetchAndDispatchPointsOfInterestOnce();
  }, [dispatch, strings, userToken]);
};

export default useFetchAndDispatchPointsOfInterestOnce;
