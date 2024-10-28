import { css } from "@emotion/react";
import Slide from "@mui/material/Slide";
import { Theme, useTheme } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";

import ActiveComments from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ActiveComments";
import ReportActionContainer from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ReportActions/ReportActionContainer";
import ReportDescriptionOverlay from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ReportDescriptionOverlay";
import UserReportGroupMembers from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/UserReportGroupMembers";
import UserReportGroupMinimal from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/UserReportGroupMinimal";
import { GqlReportGroup } from "src/generated/graphQl";
import { useAppUserReports } from "src/stores/appStore";
import { ReportOverlayState } from "src/types/reportTypes";
import colors from "src/values/colors";

const userReportGroupMinimalHeightRem = 8;
const reportDescriptionOverlayHeightRem = 2.75;
const reportActionContainerHeightRem = 6;

const drawerBleedingWithDescription =
  userReportGroupMinimalHeightRem * 16 +
  reportDescriptionOverlayHeightRem * 16 +
  reportActionContainerHeightRem * 16;
const drawerBleedingWithoutDescription =
  userReportGroupMinimalHeightRem * 16 + reportActionContainerHeightRem * 16;

const edgeBox = ({
  drawerBleeding,
  theme,
}: {
  drawerBleeding: number;
  theme: Theme;
}) =>
  css({
    display: "flex",
    flexDirection: "column",
    height: drawerBleeding,
    left: 0,
    position: "absolute",
    right: 0,
    top: -drawerBleeding,
    visibility: "visible",
    zIndex: theme.zIndex.userReportGroupOverlay_edgeBox,
  });

const detailsContainer = ({ drawerBleeding }: { drawerBleeding: number }) =>
  css({
    height: `calc(100vh - ${drawerBleeding}px - 5.25rem)`,
    overflowY: "scroll",
  });

const swipeableDrawer = css({
  ".MuiPaper-root": {
    overflow: "visible",
  },
});

const userGroupMinimal = css({
  alignItems: "stretch",
  flex: "1 1 auto",
  height: `${userReportGroupMinimalHeightRem}rem`,
});

const reportDescriptionOverlay = css({
  borderTop: `1px solid ${colors.grey}`,
  flex: "0 0 auto",
  height: `${reportDescriptionOverlayHeightRem}rem`,
});

const reportActionContainer = css({
  flex: "0 0 auto",
  height: `${reportActionContainerHeightRem}rem`,
});

const ModalProps = { keepMounted: true };

const UserReportGroupDialog: FC<{
  openUserReportGroupDialog: boolean;
  reportGroup: GqlReportGroup;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(
  ({
    openUserReportGroupDialog,
    reportGroup,
    setReportState,
    ...remainingProps
  }) => {
    const userReports = useAppUserReports();

    const containerRef = useRef<HTMLDivElement>(null);

    const activeUserReport =
      reportGroup?.reports?.find((report) =>
        userReports.some((userReport) => userReport.id === report.id),
      ) ?? null;

    const isPermanentReport = reportGroup.permanent;

    const theme = useTheme();

    // Note that "open" here refers to the SwipeableDrawer state. The drawer
    // content is always at least partially visible.
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    const [openUserReportCommentsForm, setOpenUserReportCommentsForm] =
      useState(false);

    const hasDescription = !!activeUserReport && !isPermanentReport;
    const drawerBleeding = hasDescription
      ? drawerBleedingWithDescription
      : drawerBleedingWithoutDescription;

    return (
      <SwipeableDrawer
        anchor="bottom"
        css={swipeableDrawer}
        open={isOpen}
        onClose={close}
        onOpen={open}
        disableSwipeToOpen={false}
        ModalProps={ModalProps}
        allowSwipeInChildren={true}
        disableDiscovery
        swipeAreaWidth={drawerBleeding}
        {...remainingProps}
      >
        <Slide direction="up" in={openUserReportGroupDialog}>
          <div css={edgeBox({ drawerBleeding, theme })} ref={containerRef}>
            <UserReportGroupMinimal
              css={userGroupMinimal}
              onClick={toggle}
              reportGroup={reportGroup}
            />

            {hasDescription && activeUserReport && (
              <ReportDescriptionOverlay
                activeUserReport={activeUserReport}
                css={reportDescriptionOverlay}
                setOpenUserReportCommentsForm={setOpenUserReportCommentsForm}
                openUserReportCommentsForm={openUserReportCommentsForm}
                setReportState={setReportState}
              />
            )}

            <ReportActionContainer
              css={reportActionContainer}
              activeUserReport={activeUserReport}
              userReportGroup={reportGroup}
              setReportState={setReportState}
            />
          </div>
        </Slide>

        {/* Part that is hidden */}
        <div css={detailsContainer({ drawerBleeding })}>
          {activeUserReport && !isPermanentReport && (
            <ActiveComments
              activeUserReport={activeUserReport}
              setOpenUserReportCommentsForm={setOpenUserReportCommentsForm}
              setReportState={setReportState}
            />
          )}
          <UserReportGroupMembers userReportGroup={reportGroup} />
        </div>
      </SwipeableDrawer>
    );
  },
);

UserReportGroupDialog.displayName = "UserReportGroupDialog";

export default UserReportGroupDialog;
