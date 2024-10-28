import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const CheckSvg: StylableFC = memo((props) => (
  <svg fill="none" viewBox="0 0 52 52" {...props}>
    <path
      d="M26 51c13.807 0 25-11.193 25-25S39.807 1 26 1 1 12.193 1 26s11.193 25 25 25Z"
      fill={colors.yellow}
      stroke={colors.darkGrey}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M35 20 22.259 33 16 26.5"
      stroke={colors.darkGrey}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
));

CheckSvg.displayName = "CheckSvg";

export default CheckSvg;
