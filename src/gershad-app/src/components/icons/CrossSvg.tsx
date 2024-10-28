import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const CrossSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 34 34" {...props}>
    <path
      d="m25.5 8.5-17 17M8.5 8.5l17 17"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
));

CrossSvg.displayName = "CrossSvg";

export default CrossSvg;
