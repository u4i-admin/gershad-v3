import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { FC, memo, useCallback, useState } from "react";

import WarningSvg from "src/components/icons/WarningSvg";
import { useAppStrings } from "src/stores/appStore";
import { dialogConfirmContainer } from "src/styles/dialogStyles";

export type ErrorMessageDialogStrings = {
  /**
   * Text for Error Dialog description when there's network error
   */
  networkErrorDescription: string;
  /**
   * Text for Error Dialog Heading when there's network error
   */
  networkErrorHeading: string;
};

const dialog = css(dialogConfirmContainer, {
  textAlign: "center",
});

const icon = css({
  height: "2.25rem",
});
const button = css({
  margin: "auto",
});

const ErrorMessageDialog: FC<{
  errorHeading: string;
  errorMessages: string;
}> = memo(({ errorHeading, errorMessages }) => {
  const { shared: strings } = useAppStrings();
  const [openErrorMessageDialog, setOpenErrorMessageDialog] =
    useState<boolean>(true);

  const onCloseErrorMessageDialog = useCallback(() => {
    setOpenErrorMessageDialog(false);
  }, [setOpenErrorMessageDialog]);

  return (
    <Dialog
      onClose={onCloseErrorMessageDialog}
      open={openErrorMessageDialog}
      css={dialog}
    >
      <WarningSvg css={icon} />

      <DialogTitle>{errorHeading}</DialogTitle>

      <DialogContent>
        <Typography variant="paraExtraSmallRegular" component="span">
          {errorMessages}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={onCloseErrorMessageDialog}
          size={"small"}
          css={button}
        >
          {strings.button.iUnderstand}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ErrorMessageDialog.displayName = "ErrorMessageDialog";

export default ErrorMessageDialog;
