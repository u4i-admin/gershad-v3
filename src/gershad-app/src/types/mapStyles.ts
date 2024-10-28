import { css } from "@emotion/react";

import colors from "src/values/colors";

export const markerAddressText = css({
  backgroundColor: colors.white,
  borderRadius: "0.5rem",
  bottom: "calc(50% + 3rem)",
  left: "50%",
  opacity: "0.7",
  padding: "1rem",
  pointerEvents: "none",
  position: "absolute",
  transform: "translate(-50%,0)",
});
export const markerContainer = css({
  left: "50%",
  pointerEvents: "none",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -75%)",
});
