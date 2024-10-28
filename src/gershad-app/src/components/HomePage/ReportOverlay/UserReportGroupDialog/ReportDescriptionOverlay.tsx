import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { Dispatch, memo, SetStateAction, useCallback } from "react";

import ReportDescriptionOverlayContent from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ReportDescriptionOverlayContent";
import ChevronSvg from "src/components/icons/ChevronSvg";
import MessageSvg from "src/components/icons/MessageSvg";
import SegmentContainer from "src/components/SegmentContainer";
import { GqlReport } from "src/generated/graphQl";
import { useAppStrings } from "src/stores/appStore";
import { textOverflowEllipsis } from "src/styles/generalStyles";
import { ReportOverlayState } from "src/types/reportTypes";
import colors from "src/values/colors";

export type ReportDescriptionOverlayStrings = {
  /**
   * Text for add description place holder
   */
  placeHolder: string;
};

const descriptionContainer = css({
  alignItems: "center",
  backgroundColor: colors.white,
  display: "flex",
  gap: "0.5rem",
  height: "100%",
  width: "100vw",
});

const descriptionIcon = css({
  color: colors.darkGrey,
  height: "1.25rem",
});

const chevronIcon = css(
  {
    color: colors.darkGrey,
    height: "1.25rem",
  },
  {
    "html.rtl &": {
      transform: "rotate(180deg)",
    },
  },
);

const descriptionInput = css(textOverflowEllipsis, {
  flex: 1,
});

const placeHolderInput = css(descriptionInput, {
  color: colors.grey,
});

const ReportDescriptionOverlay: StylableFC<{
  activeUserReport: GqlReport;
  openUserReportCommentsForm: boolean;
  setOpenUserReportCommentsForm: Dispatch<SetStateAction<boolean>>;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(
  ({
    activeUserReport,
    openUserReportCommentsForm,
    setOpenUserReportCommentsForm,
    setReportState,
    ...remainingProps
  }) => {
    const { ReportDescriptionOverlay: strings } = useAppStrings();

    const onOpenUserReportCommentsFormClick = useCallback(() => {
      setOpenUserReportCommentsForm(true);
    }, [setOpenUserReportCommentsForm]);

    const onCloseUserReportCommentsFormClick = useCallback(() => {
      setOpenUserReportCommentsForm(false);
    }, [setOpenUserReportCommentsForm]);

    return (
      <>
        <ButtonBase
          onClick={onOpenUserReportCommentsFormClick}
          {...remainingProps}
        >
          <SegmentContainer css={descriptionContainer} padding="narrow">
            <MessageSvg css={descriptionIcon} />
            <Typography
              variant="paraSmall"
              css={
                activeUserReport.description
                  ? descriptionInput
                  : placeHolderInput
              }
              component="p"
            >
              {activeUserReport.description
                ? activeUserReport.description
                : strings.placeHolder}
            </Typography>
            <ChevronSvg css={chevronIcon} direction="end" />
          </SegmentContainer>
        </ButtonBase>

        <ReportDescriptionOverlayContent
          activeUserReport={activeUserReport}
          openUserReportCommentsForm={openUserReportCommentsForm}
          onCloseUserReportCommentsFormClick={
            onCloseUserReportCommentsFormClick
          }
          setReportState={setReportState}
        />
      </>
    );
  },
);

ReportDescriptionOverlay.displayName = "ReportDescriptionOverlay";

export default ReportDescriptionOverlay;
