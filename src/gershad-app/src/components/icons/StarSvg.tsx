import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const StarSvg: StylableFC<{ isFilled: boolean }> = memo(
  ({ isFilled, ...props }) => (
    <svg fill="none" stroke="currentcolor" viewBox="0 0 52 52" {...props}>
      <path
        d="M26 51c13.807 0 25-11.193 25-25S39.807 1 26 1 1 12.193 1 26s11.193 25 25 25Z"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="m26.29 16.47 2.539 5.488c.098.305.39.406.684.508l5.762.914c.156.03.301.101.42.209.12.107.21.246.26.402a.95.95 0 0 1-.191.913l-4.2 4.268a.82.82 0 0 0-.195.813l.976 5.996a.937.937 0 0 1-.068.482.898.898 0 0 1-.3.376.849.849 0 0 1-.902.056L25.9 34.05a1.035 1.035 0 0 0-.782 0l-5.176 2.845a.86.86 0 0 1-.89-.075.918.918 0 0 1-.298-.367.96.96 0 0 1-.082-.472l.977-5.996a1.14 1.14 0 0 0-.196-.813l-4.2-4.268a1.019 1.019 0 0 1-.21-.96.987.987 0 0 1 .264-.43.93.93 0 0 1 .435-.235l5.762-.915c.294 0 .489-.203.684-.508l2.54-5.487a.969.969 0 0 1 .36-.285.93.93 0 0 1 .879.057.983.983 0 0 1 .323.33v0Z"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        fill={isFilled ? "currentcolor" : undefined}
        strokeLinejoin="round"
      />
    </svg>
  ),
);

StarSvg.displayName = "StarSvg";

export default StarSvg;
