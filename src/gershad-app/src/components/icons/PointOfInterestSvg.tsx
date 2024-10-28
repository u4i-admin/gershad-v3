import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const PointOfInterestSvg: StylableFC = memo((props) => (
  <svg viewBox="0 0 34 46" {...props}>
    <path
      d="M18.15 5.104a4.809 4.809 0 0 0-1.186-.1 4.81 4.81 0 0 0-1.185.1A11.858 11.858 0 0 0 5.011 16.66a13.828 13.828 0 0 0 1.976 7.705 108.402 108.402 0 0 0 3.754 5.532 56.564 56.564 0 0 1 6.125 10.57c0 .1.2.1.2 0a56.564 56.564 0 0 1 6.126-10.57 109.025 109.025 0 0 0 3.753-5.532 14.04 14.04 0 0 0 1.976-7.705A11.938 11.938 0 0 0 18.15 5.104Z"
      fill={colors.yellow}
      stroke={colors.darkGrey}
      strokeWidth="2"
      strokeMiterlimit="10"
    />
    <path
      d="m17.427 11.84 1.375 2.858c.053.159.212.212.37.265l3.121.476a.473.473 0 0 1 .264.794l-2.275 2.222a.41.41 0 0 0-.106.423l.53 3.12a.47.47 0 0 1-.689.477l-2.8-1.481a.58.58 0 0 0-.423 0l-2.8 1.48a.483.483 0 0 1-.688-.475l.53-3.121a.57.57 0 0 0-.107-.423l-2.275-2.222a.51.51 0 0 1 .264-.846l3.121-.476c.16 0 .264-.106.37-.264l1.375-2.857a.521.521 0 0 1 .843.05Z"
      fill={colors.darkGrey}
      stroke={colors.darkGrey}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

PointOfInterestSvg.displayName = "PointOfInterestSvg";

export default PointOfInterestSvg;
