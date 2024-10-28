import { StylableFC } from "@asl-19/react-dom-utils";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { memo, useCallback, useState } from "react";

import StarSvg from "src/components/icons/StarSvg";
import { GqlReportGroup } from "src/generated/graphQl";
import {
  useAppDispatch,
  useAppPointOfInterests,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import { reportActionIcon, reportActionItem } from "src/styles/reportStyles";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import {
  logDeleteLocationFail,
  logDeleteLocationSuccess,
  logSaveLocationFail,
  logSaveLocationSuccess,
} from "src/utils/firebaseAnalytics";
import getFormattedAddress from "src/utils/googlemaps/getFormattedAddress";

const ReportActionBookmarkButton: StylableFC<{
  userReportGroup: GqlReportGroup;
}> = memo(({ userReportGroup: { centroidLatitude, centroidLongitude } }) => {
  const dispatch = useAppDispatch();
  const pointOfInterests = useAppPointOfInterests();
  const strings = useAppStrings();
  const userToken = useAppUserToken();

  const bookmarkedPointOfInterest = pointOfInterests.filter(
    (location) =>
      location.location.y === centroidLatitude &&
      location.location.x === centroidLongitude,
  )[0];

  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    !!bookmarkedPointOfInterest,
  );

  const onBookmarkClick = useCallback(async () => {
    try {
      const graphQlSdk = await getGraphQlSdk({ method: "POST" });
      if (isBookmarked) {
        const deletePointOfInterestsResponse =
          await graphQlSdk.doDeletePointOfInterest({
            pk: bookmarkedPointOfInterest.pk,
            token: userToken,
          });

        const deletePointOfInterests =
          deletePointOfInterestsResponse.deletePointOfInterest;

        if (deletePointOfInterests.errors) {
          dispatch({
            messageStringKey: "shared.toasts.bookmarkDeleteFailed",
            messageType: "warning",
            type: "snackbarQueued",
          });

          logDeleteLocationFail();
        } else {
          setIsBookmarked(false);
          dispatch({
            messageStringKey: "shared.toasts.bookmarkDeleteSucceeded",
            messageType: "warning",
            type: "snackbarQueued",
          });
          dispatch({
            pointOfInterest: bookmarkedPointOfInterest,
            type: "removePointOfInterest",
          });

          logDeleteLocationSuccess();
        }
      } else {
        const formattedAddress = await getFormattedAddress({
          lat: centroidLatitude,
          lng: centroidLongitude,
        });

        const savedLocation = {
          address: formattedAddress ?? "",
          arn: "",
          latitude: centroidLatitude,
          longitude: centroidLongitude,
          token: userToken,
        };

        const createPointOfInterestsResponse =
          await graphQlSdk.doCreatePointOfInterest(savedLocation);

        const createPointsOfInterest =
          createPointOfInterestsResponse.createPointOfInterest;

        if (createPointsOfInterest.errors) {
          dispatch({
            messageStringKey: "shared.toasts.bookmarkAddFailed",
            messageType: "error",
            type: "snackbarQueued",
          });

          logSaveLocationFail();
        } else {
          setIsBookmarked(true);
          dispatch({
            pointsOfInterest: createPointsOfInterest.pointOfInterest
              ? [...pointOfInterests, createPointsOfInterest.pointOfInterest]
              : pointOfInterests,
            type: "updatePointsOfInterest",
          });

          logSaveLocationSuccess();
        }
      }
    } catch (error) {
      dispatch({
        messageStringKey: "shared.toasts.bookmarkAddFailed",
        messageType: "warning",
        type: "snackbarQueued",
      });
    }
  }, [
    bookmarkedPointOfInterest,
    centroidLatitude,
    centroidLongitude,
    dispatch,
    isBookmarked,
    pointOfInterests,
    userToken,
  ]);

  return (
    <ButtonBase css={reportActionItem} onClick={onBookmarkClick}>
      <StarSvg css={reportActionIcon} isFilled={isBookmarked} />
      <Typography variant="headingH5" component="span">
        {isBookmarked
          ? strings.shared.button.bookmarked
          : strings.shared.button.bookmark}
      </Typography>
    </ButtonBase>
  );
});

ReportActionBookmarkButton.displayName = "ReportActionBookmarkButton";

export default ReportActionBookmarkButton;
