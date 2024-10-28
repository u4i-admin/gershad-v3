import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const LocationSvg: StylableFC = memo((props) => (
  <svg stroke="none" viewBox="0 0 27 38" {...props}>
    <path
      fill="currentcolor"
      stroke={colors.darkGrey}
      strokeMiterlimit="10"
      strokeWidth="2"
      d="M14.32 1.104a4.872 4.872 0 0 0-1.2-.1 4.872 4.872 0 0 0-1.2.1A12.012 12.012 0 0 0 1.013 12.812a14.008 14.008 0 0 0 2 7.805c1.2 1.9 2.5 3.8 3.8 5.6a57.31 57.31 0 0 1 6.2 10.707c0 .1.2.1.2 0a57.31 57.31 0 0 1 6.2-10.707c1.3-1.8 2.6-3.7 3.8-5.6a14.224 14.224 0 0 0 2-7.805A12.093 12.093 0 0 0 14.32 1.104Zm-1.2 18.013a6.054 6.054 0 1 1 5.9-6.1 5.9 5.9 0 0 1-5.9 6.1Z"
    />
  </svg>
));

LocationSvg.displayName = "LocationSvg";

export default LocationSvg;
