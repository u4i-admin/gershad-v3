import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const RoundedPointOfInterestSvg: StylableFC = memo((props) => (
  <svg fill="none" viewBox="0 0 81 80" {...props}>
    <circle cx="40.5" cy="40" r="38" stroke={colors.darkGrey} strokeWidth="4" />
    <path
      d="m41.853 22.806 4.354 9.407c.167.523.67.697 1.172.871l9.879 1.568c.267.05.515.173.72.357.206.185.359.423.445.69.085.268.1.555.042.83a1.59 1.59 0 0 1-.37.736l-7.2 7.316c-.176.177-.3.4-.36.647-.059.246-.05.505.025.747l1.674 10.278c.035.281-.006.568-.117.827a1.54 1.54 0 0 1-.513.644 1.444 1.444 0 0 1-1.546.096l-8.874-4.877a1.775 1.775 0 0 0-1.34 0L30.97 57.82a1.476 1.476 0 0 1-1.524-.129 1.575 1.575 0 0 1-.512-.628 1.646 1.646 0 0 1-.14-.81l1.674-10.278a1.95 1.95 0 0 0-.335-1.394l-7.2-7.316a1.704 1.704 0 0 1-.393-.773c-.063-.29-.052-.59.034-.874a1.69 1.69 0 0 1 .45-.738c.21-.2.468-.339.746-.402l9.879-1.568c.502 0 .837-.348 1.172-.871l4.353-9.407a1.66 1.66 0 0 1 .618-.488 1.596 1.596 0 0 1 1.506.098c.226.14.416.333.555.564v0Z"
      stroke={colors.darkGrey}
      strokeWidth="4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

RoundedPointOfInterestSvg.displayName = "RoundedPointOfInterestSvg";

export default RoundedPointOfInterestSvg;
