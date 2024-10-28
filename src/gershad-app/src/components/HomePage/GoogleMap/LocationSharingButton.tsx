import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Fab from "@mui/material/Fab";
import Link from "next/link";
import { memo } from "react";
import { match } from "ts-pattern";

import LocationSharingSvg from "src/components/icons/LocationSharingSvg";
import routeUrls from "src/routeUrls";
import { useAppBackgroundGeolocationTrackingState } from "src/stores/appStore";
import { googleMapButton } from "src/styles/googleMapStyles";
import { MuiSx } from "src/types/styleTypes";
import colors from "src/values/colors";

const buttonUnclickable = css(googleMapButton, {
  pointerEvents: "none",
});

const buttonClickable = css(googleMapButton, {
  pointerEvents: "initial",
});

// Note: Commented out animation since it significantly increases resource usage
// (paints, style recalcs, CPU usage). We either need to figured out a
// performance improvement or remove entirely.
const buttonActive = css({
  backgroundColor: colors.yellow,
  // animationDuration: "3s",
  // animationIterationCount: "infinite",
  // animationName: keyframes({
  //   "0%, 25%, 75%, 100%": {
  //     backgroundColor: colors.yellow,
  //   },
  //   "50%": {
  //     backgroundColor: colors.yellowDark,
  //   },
  // }),
  // animationTimingFunction: "ease-in-out",
  // willChange: "background-color",
});

const buttonUnclickableActive = css(buttonUnclickable, buttonActive);

const buttonClickableActive = css(buttonClickable, buttonActive);

const icon = css(
  {
    height: "1.75rem",
    width: "1.75rem",
  },
  {
    // Subjective adjustment to account for content of icon being off-centre
    "html.en &": {
      transform: "translateX(0.2rem)",
    },
    "html.fa &": {
      transform: "translateX(-0.2rem)",
    },
  },
);

const LocationSharingButton: StylableFC<{
  clickable: boolean;
  sx?: MuiSx;
}> = memo(({ clickable, sx, ...remainingProps }) => {
  const appBackgroundGeolocationTrackingState =
    useAppBackgroundGeolocationTrackingState();

  return (
    <Fab
      css={match({
        active: appBackgroundGeolocationTrackingState === "enabled",
        clickable,
      })
        .with({ active: false, clickable: false }, () => buttonUnclickable)
        .with({ active: false, clickable: true }, () => buttonClickable)
        .with({ active: true, clickable: false }, () => buttonUnclickableActive)
        .with({ active: true, clickable: true }, () => buttonClickableActive)
        .exhaustive()}
      href={routeUrls.settings()}
      LinkComponent={Link}
      size="small"
      sx={sx}
      {...remainingProps}
    >
      <LocationSharingSvg css={icon} />
    </Fab>
  );
});

LocationSharingButton.displayName = "LocationSharingButton";

export default LocationSharingButton;
