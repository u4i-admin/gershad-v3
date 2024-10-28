import { css } from "@emotion/react";

import colors from "src/values/colors";

export const reportActionItem = css({
  alignItems: "center",
  display: "flex",
  flex: "0 1 auto",
  flexDirection: "column",
  gap: "0.5rem",
  minWidth: 0,

  paddingBlock: "0.25rem",

  width: "6rem",
});
export const reportActionIcon = css({
  color: colors.darkGrey,
  height: "3.125rem",
});
