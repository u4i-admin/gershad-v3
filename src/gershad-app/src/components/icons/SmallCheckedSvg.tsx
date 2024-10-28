import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const SmallCheckedSvg: StylableFC = memo((props) => (
  <svg fill="none" viewBox="0 0 19 19" {...props}>
    <path
      d="M9.5 17a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
      fill={colors.green}
    />
    <path
      d="m12.705 7.386-4.296 4.228L6.295 9.5"
      stroke={colors.white}
      strokeWidth="2"
      strokeMiterlimit="10"
    />
  </svg>
));

SmallCheckedSvg.displayName = "SmallCheckedSvg";

export default SmallCheckedSvg;
