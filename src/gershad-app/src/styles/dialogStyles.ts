import { css } from "@emotion/react";

import colors from "src/values/colors";

export const dialogContainer = ({ index }: { index: number }) =>
  css({
    "&": {
      zIndex: index,
    },
    "& .MuiBackdrop-root": {
      backgroundColor: "transparent",
    },
    "& .MuiDialog-container": {
      alignItems: "flex-end",
      width: "100%",
    },
    "& .MuiPaper-root": {
      alignItems: "center",
      background: "none",
      boxShadow: "none",
      color: colors.white,
      margin: 0,
      maxHeight: "100vh",
      maxWidth: "100vw",
      overflow: "unset",
    },
  });

export const confirmDialogContainer = css({
  "& .MuiPaper-root": {
    background: colors.white,
    borderRadius: "0.75rem",
    padding: "1rem",
  },
});

export const dialogConfirmContainer = css({
  "& .MuiPaper-root": {
    background: colors.white,
    borderRadius: "0.75rem",
    maxWidth: "16.5rem",
    padding: "1rem",
  },
});

export const dialogTitle = css({
  textAlign: "center",
});
