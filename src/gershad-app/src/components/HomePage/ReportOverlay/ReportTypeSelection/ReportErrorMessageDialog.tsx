import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { Dispatch, FC, memo, SetStateAction, useCallback } from "react";
import { match } from "ts-pattern";

import WarningSvg from "src/components/icons/WarningSvg";
import { useAppStrings } from "src/stores/appStore";
import { confirmDialogContainer } from "src/styles/dialogStyles";
import {
  ReportOverlayErrorType,
  ReportOverlayState,
} from "src/types/reportTypes";

export type ReportErrorMessageDialogStrings = {
  /**
   * button Text
   */
  buttonText: string;
  /**
   * Text for Error Dialog Heading
   */
  heading: string;
  /**
   * Text for invalid
   */
  invalid: string;
  /**
   * Text for no internet connection error
   */
  noInternetConnection: string;
  /**
   * Text for unexpected
   */
  unexpected: string;
};

const container = css({
  alignItem: "center",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "2rem",
  textAlign: "center",
});

const headingAndDescription = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});
const icon = css({
  height: "2.25rem",
});

const ReportErrorMessageDialog: FC<{
  errorType: ReportOverlayErrorType;
  message?: string;
  openErrorMessageDialog: boolean;
  setReportState: Dispatch<SetStateAction<ReportOverlayState | undefined>>;
}> = memo(
  ({
    errorType,
    message,
    openErrorMessageDialog,
    setReportState,
    ...remainingProps
  }) => {
    const { ReportErrorMessageDialog: strings } = useAppStrings();

    const onCloseErrorMessageDialog = useCallback(() => {
      setReportState({ type: "isNotReporting" });
    }, [setReportState]);

    const errorMessage = match(errorType)
      .with("noInternetConnection", () => strings.noInternetConnection)
      .with("invalid", () => strings.invalid)
      .with("unexpected", () => strings.unexpected)
      .exhaustive();

    return (
      <Dialog
        onClose={onCloseErrorMessageDialog}
        aria-labelledby="customized-dialog-title"
        open={openErrorMessageDialog}
        css={confirmDialogContainer}
      >
        <div css={container} {...remainingProps}>
          <WarningSvg css={icon} />
          <div css={headingAndDescription}>
            <Typography variant="headingH5" component="h2">
              {strings.heading}
            </Typography>
            <ul>
              <li>
                <Typography variant="paraExtraSmallRegular" component="p">
                  {message ?? errorMessage}
                </Typography>
              </li>
            </ul>
          </div>
          <Button
            variant="contained"
            onClick={onCloseErrorMessageDialog}
            size={"small"}
          >
            {strings.buttonText}
          </Button>
        </div>
      </Dialog>
    );
  },
);

ReportErrorMessageDialog.displayName = "ReportErrorMessageDialog";

export default ReportErrorMessageDialog;
