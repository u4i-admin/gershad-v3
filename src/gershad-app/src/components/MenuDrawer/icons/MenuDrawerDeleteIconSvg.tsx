import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuDrawerDeleteIconSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 25 25" {...props}>
    <path
      // stroke="#3B3B3B"
      strokeWidth="1.5"
      d="M6.286 9v11.375a1 1 0 0 0 1 1h9.428a1 1 0 0 0 1-1V9M4.75 7c0-.69.56-1.25 1.25-1.25h12c.69 0 1.25.56 1.25 1.25v1.75H4.75V7ZM14.286 5.125V5a1 1 0 0 0-1-1h-2.572a1 1 0 0 0-1 1v.125"
    />
  </svg>
));

MenuDrawerDeleteIconSvg.displayName = "MenuDrawerDeleteIconSvg";

export default MenuDrawerDeleteIconSvg;
