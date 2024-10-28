import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuDrawerUpdateIconSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 25 25" {...props}>
    <path
      // stroke="#3B3B3B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M18.525 10.46A7 7 0 0 1 12 20H9m-3.525-4.46A7 7 0 0 1 12 6h3m0 0-3-3m3 3-3 3M9 20l3-3m-3 3 3 3"
    />
  </svg>
));

MenuDrawerUpdateIconSvg.displayName = "MenuDrawerUpdateIconSvg";

export default MenuDrawerUpdateIconSvg;
