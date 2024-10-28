import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const PermanentSvg: StylableFC = memo((props) => (
  <svg fill="none" viewBox="0 0 60 60" {...props}>
    <circle opacity=".15" cx="30" cy="30" r="30" fill={colors.orange} />
    <circle opacity=".25" cx="30" cy="30" r="23" fill={colors.orange} />
    <circle opacity=".35" cx="30" cy="30" r="16" fill={colors.orange} />
    <path
      d="M30 40c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
      fill={colors.orange}
    />
    <path
      d="M31.057 33.453c0 .683-.546 1.242-1.243 1.242-.696 0-1.243-.56-1.243-1.242 0-.683.547-1.243 1.243-1.243.697 0 1.243.56 1.243 1.243Zm-.673-2.486h-1.152a.32.32 0 0 1-.32-.304l-.243-5.329a.32.32 0 0 1 .319-.334h1.652a.32.32 0 0 1 .319.335l-.256 5.328a.32.32 0 0 1-.32.305Z"
      fill={colors.white}
    />
  </svg>
));

PermanentSvg.displayName = "PermanentSvg";

export default PermanentSvg;
