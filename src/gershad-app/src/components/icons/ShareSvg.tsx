import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const ShareSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 52 52" {...props}>
    <path
      d="M26 51c13.807 0 25-11.193 25-25S39.807 1 26 1 1 12.193 1 26s11.193 25 25 25Z"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M20.395 22.635h-2.01a.794.794 0 0 0-.615.223.895.895 0 0 0-.27.617v12.683a.94.94 0 0 0 .286.6.864.864 0 0 0 .598.24h14.232a.794.794 0 0 0 .614-.223.895.895 0 0 0 .27-.617V23.475a.94.94 0 0 0-.286-.6.864.864 0 0 0-.598-.24h-2.01"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M25.54 30.53V16M22.244 19.444 25.54 16l3.297 3.444"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

ShareSvg.displayName = "ShareSvg";

export default ShareSvg;
