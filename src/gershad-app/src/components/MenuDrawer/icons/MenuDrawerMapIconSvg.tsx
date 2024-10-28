import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MenuDrawerMapIconSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 25 25" {...props}>
    <path
      d="M12.5409 3H11.1339C9.45762 3.15916 7.90078 3.93719 6.76718 5.18228C5.63358 6.42737 5.00458 8.05017 5.00292 9.734C4.96242 11.3132 5.34423 12.8747 6.10892 14.257C6.80892 15.262 7.51592 16.368 8.21992 17.373C9.63545 19.0852 10.8181 20.9773 11.7369 23H11.8369C12.7935 20.9973 13.9737 19.1093 15.3549 17.372C16.0549 16.266 16.8629 15.261 17.4659 14.156C18.2764 12.792 18.6615 11.2171 18.5719 9.633C18.5906 7.96998 17.9791 6.36152 16.8603 5.131C15.7414 3.90047 14.1982 3.13912 12.5409 3V3Z"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M11.8369 12.447C13.28 12.447 14.4499 11.2771 14.4499 9.834C14.4499 8.39088 13.28 7.221 11.8369 7.221C10.3938 7.221 9.22392 8.39088 9.22392 9.834C9.22392 11.2771 10.3938 12.447 11.8369 12.447Z"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </svg>
));

MenuDrawerMapIconSvg.displayName = "MenuDrawerMapIconSvg";

export default MenuDrawerMapIconSvg;
