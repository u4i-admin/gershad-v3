import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuDrawerSupportIconSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 25 25" {...props}>
    <path
      d="M12 23c5.523 0 10-4.477 10-10S17.523 3 12 3 2 7.477 2 13s4.477 10 10 10Z"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M12 18.6a5.6 5.6 0 1 0 0-11.2 5.6 5.6 0 0 0 0 11.2ZM15.9 16.9l3.1 3.2M8 16.9l-3.1 3.2M8 9.1 4.9 5.9M15.9 9.1 19 5.9"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </svg>
));

MenuDrawerSupportIconSvg.displayName = "MenuDrawerSupportIconSvg";

export default MenuDrawerSupportIconSvg;
