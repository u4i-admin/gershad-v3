import { css } from "@emotion/react";
import { Theme, useTheme } from "@mui/material/styles";
import { FC, memo } from "react";

import LoadingIndicatorSvg from "src/components/icons/animation/LoadingIndicatorSvg";
import colors from "src/values/colors";

const loadingIndicator = css({
  height: "6rem",
  width: "6rem",
});

const loadingOverlay = ({ theme }: { theme: Theme }) =>
  css({
    alignItems: "center",
    background: colors.black,
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    left: 0,
    opacity: 0.3,
    position: "fixed",
    top: 0,
    width: "100vw",
    zIndex: theme.zIndex.loadingOverlay_loadingOverlay,
  });

const LoadingOverlay: FC = memo((props) => {
  const theme = useTheme();

  return (
    <div css={loadingOverlay({ theme })} {...props}>
      <LoadingIndicatorSvg css={loadingIndicator} />
    </div>
  );
});

LoadingOverlay.displayName = "LoadingOverlay";

export default LoadingOverlay;
