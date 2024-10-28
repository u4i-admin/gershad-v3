import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuDrawerKnowYourRightsIconSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 25 25" {...props}>
    <path
      d="m14.2 3.85-6.8 6.8M10.8 14.05l6.8-6.8M14.2 10.65l6.8 6.8M11.65 14.9l-5.1-5.1M18.45 8.1 13.35 3M17.6 22.55v-3.4H7.4v3.4M4 22.55h17"
      // stroke="#333"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

MenuDrawerKnowYourRightsIconSvg.displayName = "MenuDrawerKnowYourRightsIconSvg";

export default MenuDrawerKnowYourRightsIconSvg;
