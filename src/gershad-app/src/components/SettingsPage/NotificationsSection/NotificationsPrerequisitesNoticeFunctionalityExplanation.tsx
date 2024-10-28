import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import LocationSharingButton from "src/components/HomePage/GoogleMap/LocationSharingButton";
import {
  useAppBackgroundGeolocationTrackingState,
  useAppStrings,
} from "src/stores/appStore";

export type NotificationsPrerequisitesNoticeFunctionalityExplanationStrings = {
  disabledBody: string;
  disabledHeading: string;
  enabledBody: string;
  enabledHeading: string;
};

const box = css({
  display: "flex",
  flexDirection: "column",
  rowGap: "1rem",
});

const headingRow = css({
  alignItems: "center",
  columnGap: "1rem",
  display: "flex",
});

const locationSharingButton = css({
  flex: "0 0 auto",
});

const NotificationsPrerequisitesNoticeFunctionalityExplanation: StylableFC =
  memo(({ ...remainingProps }) => {
    const appBackgroundGeolocationTrackingState =
      useAppBackgroundGeolocationTrackingState();

    const strings = useAppStrings();

    const isActive = appBackgroundGeolocationTrackingState === "enabled";

    return (
      <Box css={box} {...remainingProps}>
        <Box css={headingRow}>
          <LocationSharingButton
            aria-hidden
            clickable={false}
            css={locationSharingButton}
          />
          <Typography component="h2" variant="h6">
            {isActive
              ? strings.NotificationsPrerequisitesNoticeFunctionalityExplanation
                  .enabledHeading
              : strings.NotificationsPrerequisitesNoticeFunctionalityExplanation
                  .disabledHeading}
          </Typography>
        </Box>
        <p>
          {isActive
            ? strings.NotificationsPrerequisitesNoticeFunctionalityExplanation
                .enabledBody
            : strings.NotificationsPrerequisitesNoticeFunctionalityExplanation
                .disabledBody}
        </p>
      </Box>
    );
  });

NotificationsPrerequisitesNoticeFunctionalityExplanation.displayName +
  'NotificationsPrerequisitesNoticeFunctionalityExplanation";';

export default NotificationsPrerequisitesNoticeFunctionalityExplanation;
