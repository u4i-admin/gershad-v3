import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Dialog from "@mui/material/Dialog";
import { Theme, useTheme } from "@mui/material/styles";
import { Dispatch, memo, SetStateAction, useCallback } from "react";

import ReportTypeSelection from "src/components/HomePage/ReportOverlay/ReportTypeSelection/ReportTypeSelection";
import CrossSvg from "src/components/icons/CrossSvg";
import { dialogContainer } from "src/styles/dialogStyles";
import { ReportOverlayState } from "src/types/reportTypes";
import colors from "src/values/colors";

const dialogOverlay = ({
  showBackground,
  theme,
}: {
  showBackground: boolean;
  theme: Theme;
}) =>
  css(
    dialogContainer({ index: theme.zIndex.reportOverlayContent_dialogOverlay }),
    {
      background: showBackground
        ? "linear-gradient(180deg, rgba(59, 59, 59, 0.47) 0%, rgba(59, 59, 59, 0.85) 54.17%)"
        : "transparent",
      paddingBottom: "2rem",
      position: "absolute",
      transition: "0.2s ease background",
    },
  );

const crossSvg = css({ color: colors.darkGrey });
const closeButton = css({
  backgroundColor: colors.white,
  borderRadius: "100%",
  height: "2.75rem",
  margin: "auto",
  marginTop: "2rem",
  width: "2.75rem",
});
const ReportTypeSelectionDialog: StylableFC<{
  reportState: ReportOverlayState;
  setReportState: Dispatch<SetStateAction<ReportOverlayState | undefined>>;
}> = memo(({ reportState, setReportState, ...remainingProps }) => {
  const theme = useTheme();

  const onCloseUserReportGroupDialogClick = useCallback(() => {
    setReportState({ type: "isNotReporting" });
  }, [setReportState]);

  return (
    <Dialog
      onClose={onCloseUserReportGroupDialogClick}
      aria-labelledby="customized-dialog-title"
      open={reportState.type === "isSelectingType"}
      css={dialogOverlay({ showBackground: true, theme })}
      {...remainingProps}
    >
      <ReportTypeSelection
        setReportState={setReportState}
        reportState={reportState}
      />

      <button css={closeButton} onClick={onCloseUserReportGroupDialogClick}>
        <CrossSvg css={crossSvg} />
      </button>
    </Dialog>
  );
});

ReportTypeSelectionDialog.displayName = "ReportTypeSelectionDialog";

export default ReportTypeSelectionDialog;
