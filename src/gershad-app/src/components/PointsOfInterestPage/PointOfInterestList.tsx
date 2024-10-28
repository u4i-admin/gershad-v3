import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import RoundedBPointOfInterestSvg from "src/components/icons/RoundedPointOfInterestSvg";
import PointOfInterestListItem from "src/components/PointsOfInterestPage/PointOfInterestListItem";
import { useAppPointOfInterests, useAppStrings } from "src/stores/appStore";
import colors from "src/values/colors";

const container = css({
  display: "flex",
  flex: "1",
  flexDirection: "column",
  gap: "1rem",
  padding: "1rem",
});

const noBPointOfInterest = css({
  color: colors.darkGrey,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  height: "100%",
  justifyContent: "center",
  paddingBottom: "5rem",
  textAlign: "center",
});

const icon = css({
  height: "5rem",
  stroke: colors.grey,
});

const PointOfInterestList: StylableFC = memo(() => {
  const { PointsOfInterestPage: strings } = useAppStrings();

  const pointOfInterests = useAppPointOfInterests();

  return (
    <div css={container}>
      {pointOfInterests && pointOfInterests.length > 0 ? (
        pointOfInterests.map((pointOfInterest) => (
          <PointOfInterestListItem
            key={pointOfInterest.id}
            pointOfInterest={pointOfInterest}
          />
        ))
      ) : (
        <div css={noBPointOfInterest}>
          <RoundedBPointOfInterestSvg css={icon} />
          <Typography variant="paraLarge" component="p">
            {strings.noBookmarkedDescription}
          </Typography>
        </div>
      )}
    </div>
  );
});

PointOfInterestList.displayName = "PointOfInterestList";

export default PointOfInterestList;
