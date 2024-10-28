import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const SmallTimeSvg: StylableFC = memo((props) => (
  <svg fill="none" viewBox="0 0 19 19" {...props}>
    <path
      d="M9.5 17a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
      fill={colors.grey}
    />
    <path
      d="M9.5 4.932V9.5l3.273 1.91"
      stroke={colors.white}
      strokeWidth="2"
      strokeMiterlimit="10"
    />
  </svg>
));

SmallTimeSvg.displayName = "SmallTimeSvg";

export default SmallTimeSvg;
