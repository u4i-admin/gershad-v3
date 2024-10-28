import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

const MessageSvg: StylableFC = memo((props) => (
  <svg fill="none" stroke="currentcolor" viewBox="0 0 25 25" {...props}>
    <path
      d="M22 18.2H7.2L2 23V3h20v15.2ZM16.9 8.2H7M16.9 13H9.5"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

MessageSvg.displayName = "MessageSvg";

export default MessageSvg;
