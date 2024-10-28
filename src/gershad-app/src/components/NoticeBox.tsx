import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import { memo, ReactNode } from "react";

import colors from "src/values/colors";

const noticeBox = css({
  backgroundColor: colors.lightGrey,
  borderRadius: "0.5rem",
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
});

const NoticeBox: StylableFC<{ children: ReactNode }> = memo(
  ({ children, ...remainingProps }) => (
    <Box css={noticeBox} {...remainingProps}>
      {children}
    </Box>
  ),
);

NoticeBox.displayName = "NoticeBox";

export default NoticeBox;
