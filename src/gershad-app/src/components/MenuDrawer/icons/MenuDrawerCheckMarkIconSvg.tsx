import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuDrawerCheckMarkIconSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 25 25" {...props}>
    <path
      d="M12 23c5.523 0 10-4.477 10-10S17.523 3 12 3 2 7.477 2 13s4.477 10 10 10Z"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="m16.2 10.2-5.7 5.6L7.7 13"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </svg>
));

MenuDrawerCheckMarkIconSvg.displayName = "MenuDrawerCheckMarkIconSvg";

export default MenuDrawerCheckMarkIconSvg;
