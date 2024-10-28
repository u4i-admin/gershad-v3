import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuDrawerGershadIconSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 25 25" {...props}>
    <path
      d="M18 20.9c-.5-3-1.6-9.3-1.7-9.5-.5-2.4-2-4.2-4.5-4.2-2.6 0-4.1 1.8-4.5 4.3 0 .2-1 5.9-1.6 9.4M12 3A10.029 10.029 0 0 0 2 13a9.86 9.86 0 0 0 3.8 7.8A9.775 9.775 0 0 0 12 23a10 10 0 0 0 6.1-2.1A9.851 9.851 0 0 0 22 13 10.029 10.029 0 0 0 12 3Z"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path d="M14.6 11.8a2.674 2.674 0 0 0-2.9-2.3 2.77 2.77 0 0 0-2.4 2.6c-.022.592.116 1.18.4 1.7.3.4 2.2 3.6 2.2 3.6s2.1-3.4 2.2-3.7a2.506 2.506 0 0 0 .5-1.9ZM12 13.5a1.3 1.3 0 1 1 1.3-1.3 1.324 1.324 0 0 1-1.3 1.3Z" />
  </svg>
));

MenuDrawerGershadIconSvg.displayName = "MenuDrawerGershadIconSvg";

export default MenuDrawerGershadIconSvg;
