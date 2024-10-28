import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const RoundCrossSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 52 52" {...props}>
    <path
      d="M26 51c13.807 0 25-11.193 25-25S39.807 1 26 1 1 12.193 1 26s11.193 25 25 25Z"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M34 18 17 35M17 18l17 17"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
));

RoundCrossSvg.displayName = "RoundCrossSvg";

export default RoundCrossSvg;
