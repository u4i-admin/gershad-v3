import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Alert from "@mui/material/Alert";
import {
  default as MuiSnackbar,
  SnackbarOrigin,
  SnackbarProps,
} from "@mui/material/Snackbar";
import { Theme, useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import { memo, useCallback, useMemo } from "react";

import {
  useAppCurrentSnackbarInfo,
  useAppDispatch,
  useAppSnackbarIsOpen,
} from "src/stores/appStore";

const snackbar = ({ theme }: { theme: Theme }) =>
  css({
    zIndex: theme.zIndex.snackbar_snackbar,
  });

const Snackbar: StylableFC = memo(() => {
  const appDispatch = useAppDispatch();

  const currentSnackbarInfo = useAppCurrentSnackbarInfo();
  const snackbarIsOpen = useAppSnackbarIsOpen();

  const theme = useTheme();

  const onClose = useCallback<NonNullable<SnackbarProps["onClose"]>>(
    (event, reason) => {
      if (reason !== "clickaway") {
        appDispatch({ type: "snackbarClosed" });
      }
    },
    [appDispatch],
  );

  const onClick = useCallback<NonNullable<SnackbarProps["onClick"]>>(() => {
    appDispatch({ type: "snackbarClosed" });
  }, [appDispatch]);

  const snackbarAnchorOrigin = useMemo<SnackbarOrigin>(
    () => ({ horizontal: "center", vertical: "bottom" }),
    [],
  );

  const snackbarTransitionProps = useMemo<TransitionProps>(
    () => ({ onExited: () => appDispatch({ type: "snackbarExited" }) }),
    [appDispatch],
  );

  const snackbarCssCombined = useMemo(
    () => [snackbar({ theme }), currentSnackbarInfo?.css],
    [currentSnackbarInfo?.css, theme],
  );

  if (!currentSnackbarInfo) {
    return <></>;
  }

  return (
    <MuiSnackbar
      onClick={onClick}
      anchorOrigin={snackbarAnchorOrigin}
      autoHideDuration={currentSnackbarInfo.duration}
      css={snackbarCssCombined}
      key={currentSnackbarInfo.timestamp}
      open={snackbarIsOpen}
      onClose={onClose}
      TransitionProps={snackbarTransitionProps}
    >
      <Alert severity={currentSnackbarInfo.type}>
        {currentSnackbarInfo.message}
      </Alert>
    </MuiSnackbar>
  );
});

Snackbar.displayName = "Snackbar";

export default Snackbar;
