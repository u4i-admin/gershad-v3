import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import { memo, useCallback, useRef } from "react";

import {
  useAppDispatch,
  useAppPointOfInterests,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import { useMapGoogleMapRef } from "src/stores/mapStore";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import {
  logSaveLocationFail,
  logSaveLocationSuccess,
} from "src/utils/firebaseAnalytics";
import getFormattedAddress from "src/utils/googlemaps/getFormattedAddress";

const container = css({
  alignItems: "center",
  bottom: "3rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  pointerEvents: "none",
  position: "fixed",
  width: "100%",
});

const button = css({
  pointerEvents: "all",
  userSelect: "none",
});

const AddPointsOfInterestButton: StylableFC = memo(() => {
  const strings = useAppStrings();
  const mapRef = useMapGoogleMapRef();
  const dispatch = useAppDispatch();
  const userToken = useAppUserToken();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointOfInterests = useAppPointOfInterests();

  const onBookmarkButtonClick = useCallback(async () => {
    const currentPosition = mapRef?.current?.getCenter();
    const currentLat = currentPosition?.lat() ?? 0;
    const currentLng = currentPosition?.lng() ?? 0;

    if (
      pointOfInterests &&
      pointOfInterests.some(
        (location) =>
          location.location.y === currentLat &&
          location.location.x === currentLng,
      )
    ) {
      dispatch({
        messageStringKey: "shared.toasts.bookmarkAddPreventedDuplicate",
        messageType: "warning",
        type: "snackbarQueued",
      });
      return;
    }

    try {
      const graphQlSdk = await getGraphQlSdk({ method: "POST" });

      const formattedAddress = await getFormattedAddress({
        lat: currentLat,
        lng: currentLng,
      });

      const createPointOfInterestResponse =
        await graphQlSdk.doCreatePointOfInterest({
          address: formattedAddress ?? "",
          arn: "",
          latitude: currentLat,
          longitude: currentLng,
          token: userToken,
        });

      const createPointsOfInterest =
        createPointOfInterestResponse.createPointOfInterest;

      if (createPointsOfInterest.errors) {
        dispatch({
          messageStringKey: "shared.toasts.bookmarkAddFailed",
          messageType: "error",
          type: "snackbarQueued",
        });

        logSaveLocationFail();
      } else {
        dispatch({
          pointsOfInterest: createPointsOfInterest.pointOfInterest
            ? [...pointOfInterests, createPointsOfInterest.pointOfInterest]
            : pointOfInterests,
          type: "updatePointsOfInterest",
        });

        dispatch({
          messageStringKey: "shared.toasts.bookmarkAddSucceeded",
          messageType: "success",
          type: "snackbarQueued",
        });

        logSaveLocationSuccess();
      }
    } catch (error) {
      dispatch({
        messageStringKey: "shared.toasts.bookmarkAddFailed",
        messageType: "error",
        type: "snackbarQueued",
      });
    }
  }, [dispatch, mapRef, pointOfInterests, userToken]);

  return (
    <div css={container} ref={containerRef}>
      <Button variant="contained" onClick={onBookmarkButtonClick} css={button}>
        {strings.shared.button.bookmarkThisLocation}
      </Button>
    </div>
  );
});

AddPointsOfInterestButton.displayName = "AddPointsOfInterestButton";

export default AddPointsOfInterestButton;
