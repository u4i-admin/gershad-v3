import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { memo } from "react";

import LocationSvg from "src/components/icons/LocationSvg";
import { markerAddressText, markerContainer } from "src/types/mapStyles";
import colors from "src/values/colors";

const icon = css({
  height: "2.25rem",
});
const iconInsideRange = css(icon, { color: colors.yellow });
const iconOutsideRange = css(icon, { color: colors.grey });

const LocationMarker: StylableFC<{
  currentLatLngIsInsideRange: boolean;
  formattedAddress: string;
}> = memo(({ className, currentLatLngIsInsideRange, formattedAddress }) => (
  <>
    <div css={markerContainer} className={className}>
      <LocationSvg
        css={currentLatLngIsInsideRange ? iconInsideRange : iconOutsideRange}
      />
    </div>
    <div css={markerAddressText}>{formattedAddress}</div>
  </>
));

LocationMarker.displayName = "LocationMarker";

export default LocationMarker;
