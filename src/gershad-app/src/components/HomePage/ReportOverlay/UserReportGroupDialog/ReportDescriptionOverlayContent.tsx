import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Dialog from "@mui/material/Dialog";
import { Theme, useTheme } from "@mui/material/styles";
import { Dispatch, memo, SetStateAction } from "react";

import AppBarTop from "src/components/AppBarTop";
import UserReportCommentsForm from "src/components/form/UserReportCommentsForm";
import SlideUpTransition from "src/components/HomePage/ReportOverlay/SlideUpTransition";
import { GqlReport } from "src/generated/graphQl";
import { useAppStrings } from "src/stores/appStore";
import { dialogContainer } from "src/styles/dialogStyles";
import { ReportOverlayState } from "src/types/reportTypes";
import colors from "src/values/colors";

export type ReportDescriptionOverlayStrings = {
  /**
   * Text for add description place holder
   */
  placeHolder: string;
};

const dialog = ({ theme }: { theme: Theme }) =>
  css(
    dialogContainer({
      index: theme.zIndex.reportDescriptionOverlay_Dialog,
    }),
    {
      "& .MuiPaper-root": {
        alignItems: "flex-start",
        background: colors.yellow,
      },
    },
  );

const overlayContainer = css({
  backgroundColor: colors.white,
  color: colors.black,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100vw",
});

const inputContainer = css({ flexGrow: 1 });

const ReportDescriptionOverlayContent: StylableFC<{
  activeUserReport: GqlReport;
  onCloseUserReportCommentsFormClick: () => void;
  openUserReportCommentsForm: boolean;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(
  ({
    activeUserReport,
    onCloseUserReportCommentsFormClick,
    openUserReportCommentsForm,
    setReportState,
  }) => {
    const { shared: strings } = useAppStrings();

    const theme = useTheme();

    return (
      <Dialog
        css={dialog({ theme })}
        open={openUserReportCommentsForm}
        TransitionComponent={SlideUpTransition}
        onClose={onCloseUserReportCommentsFormClick}
        aria-describedby="alert-dialog-slide-description"
      >
        <div css={overlayContainer}>
          <AppBarTop
            headingText={strings.button.goBack}
            onClick={onCloseUserReportCommentsFormClick}
          />
          <UserReportCommentsForm
            css={inputContainer}
            activeUserReport={activeUserReport}
            onCloseReportFormCommentClick={onCloseUserReportCommentsFormClick}
            setReportState={setReportState}
          />
        </div>
      </Dialog>
    );
  },
);

ReportDescriptionOverlayContent.displayName = "ReportDescriptionOverlayContent";

export default ReportDescriptionOverlayContent;
