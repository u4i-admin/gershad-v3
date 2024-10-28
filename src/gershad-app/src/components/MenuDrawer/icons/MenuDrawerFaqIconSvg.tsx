import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuDrawerFaqIconSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 25 25" {...props}>
    <path
      d="M20.667 17.667H8.333l-4.333 4V5h16.667v12.667Z"
      // stroke="#3B3B3B"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.275 13.907v-2.104h.67c.724 0 1.246-.11 1.568-.328.322-.22.482-.624.482-1.213V9.47c0-.679-.145-1.157-.435-1.434-.29-.277-.753-.416-1.388-.416-.456 0-.884.043-1.286.128a8.168 8.168 0 0 0-1.287.395V7.38a4.761 4.761 0 0 1 1.327-.53 7.123 7.123 0 0 1 1.515-.18c.643-.01 1.155.096 1.534.315.38.219.657.527.831.925.175.397.261.868.261 1.413v.952c0 .795-.232 1.39-.697 1.782-.464.394-1.224.59-2.277.59v1.26h-.818Zm.107 2.179c-.143 0-.214-.048-.214-.143v-.714c0-.095.07-.143.214-.143h.59c.143 0 .215.048.215.143v.714c0 .048-.021.083-.062.107a.298.298 0 0 1-.153.036h-.59Z"
      fill="#3B3B3B"
      // stroke="#333"
      strokeWidth=".335"
      strokeMiterlimit="10"
    />
  </svg>
));

MenuDrawerFaqIconSvg.displayName = "MenuDrawerFaqIconSvg";

export default MenuDrawerFaqIconSvg;
