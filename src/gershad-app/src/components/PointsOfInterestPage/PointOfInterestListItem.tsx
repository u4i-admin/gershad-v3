import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { Theme, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { memo, useCallback, useMemo, useState } from "react";

import DeleteAndUpdateConfirmationDialog from "src/components/DeleteAndUpdateConfirmationDialog";
import PointOfInterestSvg from "src/components/icons/PointOfInterestSvg";
import LinkOverlay from "src/components/LinkOverlay";
import MoreMenu from "src/components/OptionsMenu/MoreMenu";
import { MoreMenuItemOption } from "src/components/OptionsMenu/MoreMenuItem";
import { GqlPointOfInterest } from "src/generated/graphQl";
import useUpdateMapPositionAndNavigateToHome from "src/hooks/useUpdateMapPositionAndNavigateToHome";
import {
  useAppDispatch,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import { lineClampedText } from "src/styles/generalStyles";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import {
  logDeleteLocationFail,
  logDeleteLocationSuccess,
} from "src/utils/firebaseAnalytics";
import shareLocation from "src/utils/shareLocation";
import { mapZoomLevels } from "src/values/appValues";
import colors from "src/values/colors";

export type PointOfInterestListItemStrings = {
  /**
   * Text for confirmation dialog description
   */
  confirmDescription: string;
  /**
   * In-app notification messages ("toasts").
   */
  toasts: {
    /**
     * Text indicating to the user that the selected point of interest was
     * deleted.
     */
    deleteSuccess: string;
  };
};

const container = css({
  backgroundColor: colors.white,
  borderRadius: "0.25rem",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  display: "flex",
  flexDirection: "column",
  height: "13rem",
  position: "relative",
});

const mapAndIconContainer = css({
  alignItems: "center",
  display: "flex",
  height: "9rem",
  justifyContent: "center",
  position: "relative",
});

const mapImage = css({
  height: "100%",
  inset: 0,
  objectFit: "cover",
  objectPosition: "50% 50%",
  position: "absolute",
  width: "100%",
});

const bookmarkedLocationIcon = ({ theme }: { theme: Theme }) =>
  css({
    height: "2rem",
    transform: "translateY(-50%)",
    zIndex: theme.zIndex.pointOfInterestListItem_pointOfInterestIcon,
  });

const addressText = css({
  alignItems: "center",
  display: "flex",
  flexGrow: 1,
  justifyContent: "center",
  padding: "1rem",
});

const addressLine = css(
  lineClampedText({ fontSize: "1rem", lineCount: 1, lineHeight: 1.4 }),
);

const bookmarkedOptionsMenu = ({ theme }: { theme: Theme }) =>
  css({
    insetBlockStart: "0.25rem",
    insetInlineEnd: "0.25rem",
    position: "absolute",
    zIndex: theme.zIndex.pointOfInterestListItem_bookmarkedOptionsMenu,
  });

const PointOfInterestListItem: StylableFC<{
  pointOfInterest: GqlPointOfInterest;
}> = memo(({ pointOfInterest }) => {
  const strings = useAppStrings();
  const router = useRouter();

  const dispatch = useAppDispatch();

  const userToken = useAppUserToken();

  const updateMapPositionAndNavigateToHome =
    useUpdateMapPositionAndNavigateToHome();

  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
    useState<boolean>(false);

  const theme = useTheme();

  // Construct the URL for the map image
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${pointOfInterest.location.y},${pointOfInterest.location.x}&format=png&maptype=roadmap&scale=2&size=600x400&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&zoom=${mapZoomLevels.locationFocussed}`;

  const position: google.maps.LatLngLiteral = useMemo(
    () => ({
      lat: pointOfInterest.location.y ?? 0,
      lng: pointOfInterest.location.x ?? 0,
    }),
    [pointOfInterest],
  );

  //Handle Menu Item click
  const onShareItemClick = useCallback(() => {
    shareLocation({ location: position });
  }, [position]);

  const onDeleteItemClick = useCallback(() => {
    setConfirmationDialogIsOpen(true);
  }, []);

  const deletePointOfInterests = useCallback(async () => {
    try {
      const graphQlSdk = await getGraphQlSdk({ method: "POST" });

      const deletePointOfInterestResponse =
        await graphQlSdk.doDeletePointOfInterest({
          pk: pointOfInterest.pk,
          token: userToken,
        });

      const deletePointOfInterest =
        deletePointOfInterestResponse.deletePointOfInterest;

      if (deletePointOfInterest.errors) {
        dispatch({
          messageStringKey: "shared.toasts.bookmarkDeleteFailed",
          messageType: "warning",
          type: "snackbarQueued",
        });

        logDeleteLocationFail(router.asPath);
      } else {
        dispatch({
          pointOfInterest,
          type: "removePointOfInterest",
        });

        dispatch({
          messageStringKey: "shared.toasts.bookmarkDeleteSucceeded",
          messageType: "success",
          type: "snackbarQueued",
        });
      }

      logDeleteLocationSuccess(router.asPath);
    } catch (error) {
      dispatch({
        messageStringKey: "shared.toasts.bookmarkDeleteFailed",
        messageType: "warning",
        type: "snackbarQueued",
      });
    }
  }, [dispatch, pointOfInterest, router.asPath, userToken]);

  const moreMenuOptions = useMemo<Array<MoreMenuItemOption>>(
    () => [
      {
        name: strings.shared.button.share,
        onClick: onShareItemClick,
      },
      {
        name: strings.shared.button.delete,
        onClick: onDeleteItemClick,
      },
    ],
    [onDeleteItemClick, onShareItemClick, strings],
  );

  const onLinkOverlayClick = useCallback(() => {
    updateMapPositionAndNavigateToHome({
      lat: pointOfInterest.location.y,
      lng: pointOfInterest.location.x,
      zoom: mapZoomLevels.locationFocussed,
    });
  }, [pointOfInterest, updateMapPositionAndNavigateToHome]);

  return (
    <div css={container}>
      <>
        <MoreMenu
          options={moreMenuOptions}
          css={bookmarkedOptionsMenu({ theme })}
          horizontalAlignment="end"
        />

        <DeleteAndUpdateConfirmationDialog
          openDialog={confirmationDialogIsOpen}
          setOpenDialog={setConfirmationDialogIsOpen}
          description={strings.PointOfInterestListItem.confirmDescription}
          onConfirmClick={deletePointOfInterests}
        />
      </>

      <div css={mapAndIconContainer}>
        {/* The size of mapAndIconContainer is fixed and imageUrl fills it */}
        {/* eslint-disable-next-line @mizdra/layout-shift/require-size-attributes */}
        <img alt="" css={mapImage} src={staticMapUrl} />
        <PointOfInterestSvg css={bookmarkedLocationIcon({ theme })} />
      </div>
      <div css={addressText}>
        <p css={addressLine}>{pointOfInterest.address}</p>
      </div>

      <LinkOverlay onClick={onLinkOverlayClick} />
    </div>
  );
});

PointOfInterestListItem.displayName = "PointOfInterestListItem";

export default PointOfInterestListItem;
