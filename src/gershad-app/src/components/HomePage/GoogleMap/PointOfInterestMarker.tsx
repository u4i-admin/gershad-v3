import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { memo } from "react";

import PointOfInterestSvg from "src/components/icons/PointOfInterestSvg";
import { markerAddressText, markerContainer } from "src/types/mapStyles";
import colors from "src/values/colors";

const icon = css({
  color: colors.yellow,
  height: "3rem",
});

const PointOfInterestMarker: StylableFC<{
  formattedAddress: string;
}> = memo(({ className, formattedAddress }) => (
  <>
    <div css={markerContainer} className={className}>
      <PointOfInterestSvg css={icon} />
    </div>
    <div css={markerAddressText}>{formattedAddress}</div>
  </>
));

PointOfInterestMarker.displayName = "PointOfInterestMarker";

export default PointOfInterestMarker;
