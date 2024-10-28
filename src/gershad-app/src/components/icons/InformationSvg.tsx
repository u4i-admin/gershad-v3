import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const InformationSvg: StylableFC<{ color?: string }> = memo(
  ({ color = colors.grey, ...remainingProps }) => (
    <svg fill="none" viewBox="0 0 17 18" {...remainingProps}>
      <path
        stroke={color}
        strokeMiterlimit="10"
        strokeWidth="1.5"
        d="M8 14.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
      />
      <path stroke={color} strokeWidth="1.5" d="M8 7.5v5M8 5v1.5" />
    </svg>
  ),
);

InformationSvg.displayName = "InformationSvg";

export default InformationSvg;
