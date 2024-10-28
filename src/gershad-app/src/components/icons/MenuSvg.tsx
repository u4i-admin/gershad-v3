import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuSvg: StylableFC = memo((props) => (
  <svg stroke="currentcolor" viewBox="0 0 24 24" {...props}>
    <path
      d="M2 3H22"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M2 12H22"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M2 21H22"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
));

MenuSvg.displayName = "MenuSvg";

export default MenuSvg;
