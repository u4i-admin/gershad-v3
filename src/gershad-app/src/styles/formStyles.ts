import { css } from "@emotion/react";

import colors from "src/values/colors";

export const formInput = css({
  ":after": {
    borderBottomColor: colors.yellow,
  },
  background: colors.lightGrey,
  height: "2.5rem",
  textIndent: "1rem",
});
