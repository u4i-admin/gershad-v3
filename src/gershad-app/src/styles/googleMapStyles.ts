import { css } from "@emotion/react";

import colors from "src/values/colors";

export const googleMapButton = css(
  {
    backgroundColor: colors.white,
    color: colors.darkGrey,
  },
  {
    "&.Mui-disabled": {
      backgroundColor: colors.grey,
      color: colors.darkGrey,
    },
    ":hover": {
      backgroundColor: colors.white,
    },
  },
);
