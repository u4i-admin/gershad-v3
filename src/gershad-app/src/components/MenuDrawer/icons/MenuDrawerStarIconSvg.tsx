import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuDrawerStarIconSvg: StylableFC = memo((props) => (
  <svg fill="none" viewBox="0 0 25 25" {...props}>
    <path
      d="m13.29 2.47 2.539 5.488c.098.305.39.406.684.508l5.762.914c.156.03.301.101.42.209.12.107.21.246.26.402a.95.95 0 0 1-.191.914l-4.2 4.267a.82.82 0 0 0-.195.813l.976 5.996a.937.937 0 0 1-.068.482.898.898 0 0 1-.3.376.849.849 0 0 1-.902.056L12.9 20.05a1.035 1.035 0 0 0-.782 0l-5.176 2.845a.86.86 0 0 1-.89-.075.918.918 0 0 1-.298-.367.96.96 0 0 1-.082-.472l.977-5.996a1.138 1.138 0 0 0-.196-.813l-4.2-4.268a1.019 1.019 0 0 1-.21-.96.986.986 0 0 1 .264-.43.93.93 0 0 1 .435-.235l5.763-.915c.293 0 .488-.203.683-.508l2.54-5.487a.968.968 0 0 1 .36-.285.93.93 0 0 1 .879.057.982.982 0 0 1 .324.33v0Z"
      stroke="currentcolor"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

MenuDrawerStarIconSvg.displayName = "MenuDrawerStarIconSvg";

export default MenuDrawerStarIconSvg;
