import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import colors from "src/values/colors";

const LogoSvg: StylableFC = memo((props) => (
  <svg viewBox="0 0 150 150" {...props}>
    <path
      fill={colors.black}
      d="M75 0a74.972 74.972 0 1 0 75 75A75.069 75.069 0 0 0 75 0Zm44.395 126.89-9.321-54c-.1-1.922-1.393-7.687-1.73-9.561C104.885 45.163 93.69 31.47 74.52 31.47c-19.266 0-30.557 13.885-33.873 32.143-.336 1.73-1.489 6.678-1.586 8.5l-9.273 54a68.29 68.29 0 0 1 6.805-107.59 68.288 68.288 0 0 1 82.801 108.359l.001.008Z"
    />
    <path
      fill={colors.white}
      d="M75.096 108.824c-.1-.192-.144-.24-.192-.336a90.985 90.985 0 0 0-10.138-17.537c-2.162-3.027-4.276-6.1-6.2-9.273a24.1 24.1 0 0 1-3.311-12.876 19.786 19.786 0 0 1 39.4-2.114A23.068 23.068 0 0 1 91.82 81.15c-1.249 2.258-2.691 4.468-4.18 6.63a130.852 130.852 0 0 0-9.033 13.789c-1.2 2.21-2.21 4.516-3.315 6.823-.052.096-.1.19-.196.432Zm0-49.439a9.9 9.9 0 1 0 9.9 9.9 9.946 9.946 0 0 0-9.9-9.903v.003Z"
    />
    <path
      fill={colors.yellow}
      d="M40.647 63.613C44.01 45.307 55.253 31.47 74.52 31.47c19.122 0 30.365 13.693 33.824 31.855.336 1.826 1.682 7.639 1.73 9.561l9.321 54a68.307 68.307 0 1 0-89.606-.769l9.321-54a82.79 82.79 0 0 1 1.537-8.504Z"
    />
  </svg>
));

LogoSvg.displayName = "LogoSvg";

export default LogoSvg;