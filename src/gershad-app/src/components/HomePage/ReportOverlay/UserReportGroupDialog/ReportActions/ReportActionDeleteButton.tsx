import { StylableFC } from "@asl-19/react-dom-utils";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { Dispatch, memo, SetStateAction, useCallback, useState } from "react";

import DeleteAndUpdateConfirmationDialog from "src/components/DeleteAndUpdateConfirmationDialog";
import RoundCrossSvg from "src/components/icons/RoundCrossSvg";
import { GqlReport } from "src/generated/graphQl";
import {
  useAppDispatch,
  useAppReportGroups,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import { reportActionIcon, reportActionItem } from "src/styles/reportStyles";
import { ReportOverlayState } from "src/types/reportTypes";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import {
  logDeleteReportFail,
  logDeleteReportSuccess,
} from "src/utils/firebaseAnalytics";

export type ReportActionDeleteButtonStrings = {
  confirmDescription: string;
};

const ReportActionDeleteButton: StylableFC<{
  activeUserReport: GqlReport;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(({ activeUserReport, setReportState }) => {
  const strings = useAppStrings();
  const appReportGroups = useAppReportGroups();
  const dispatch = useAppDispatch();
  const userToken = useAppUserToken();

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const onDeleteClick = useCallback(() => setOpenDialog(true), []);

  const handleDeleteReport = useCallback(async () => {
    if (!appReportGroups) return;

    try {
      const graphQlSdk = await getGraphQlSdk({ method: "POST" });

      const deleteReportResponse = await graphQlSdk.doDeleteReport({
        pk: activeUserReport.pk,
        token: userToken,
      });

      const deleteReport = deleteReportResponse.deleteReport;

      if (deleteReport.errors) {
        dispatch({
          messageStringKey: "shared.toasts.reportDeleteFailed",
          messageType: "error",
          type: "snackbarQueued",
        });

        logDeleteReportFail();
      } else {
        dispatch({
          type: "reportsRefetchRequested",
        });

        dispatch({
          messageStringKey: "shared.toasts.reportDeleteSucceeded",
          messageType: "success",
          type: "snackbarQueued",
        });

        logDeleteReportSuccess();
      }
    } catch (error) {
      dispatch({
        messageStringKey: "shared.toasts.dataLoadFailed",
        messageType: "error",
        type: "snackbarQueued",
      });
    }

    setReportState({ type: "isNotReporting" });
  }, [activeUserReport, dispatch, appReportGroups, setReportState, userToken]);

  return (
    <>
      <ButtonBase css={reportActionItem} onClick={onDeleteClick}>
        <RoundCrossSvg css={reportActionIcon} />
        <Typography variant="headingH5" component="span">
          {strings.shared.button.delete}
        </Typography>
      </ButtonBase>
      <DeleteAndUpdateConfirmationDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onConfirmClick={handleDeleteReport}
        description={strings.ReportActionDeleteButton.confirmDescription}
      />
    </>
  );
});

ReportActionDeleteButton.displayName = "ReportActionDeleteButton";

export default ReportActionDeleteButton;
