import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { Dispatch, memo, SetStateAction, useCallback, useMemo } from "react";

import MenuOptionsOverlay from "src/components/OptionsMenu/MoreMenu";
import { GqlReport } from "src/generated/graphQl";
import {
  useAppDispatch,
  useAppReportGroups,
  useAppUserToken,
} from "src/stores/appStore";
import { ReportOverlayState } from "src/types/reportTypes";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import {
  logUpdateReportFail,
  logUpdateReportSuccess,
} from "src/utils/firebaseAnalytics";

const detailsContainer = css({ flexGrow: 1, whiteSpace: "pre-line" });

const reportDetails = css({
  display: "flex",
  padding: "2rem 1rem",
});

const ActiveComments: StylableFC<{
  activeUserReport: GqlReport;
  setOpenUserReportCommentsForm: Dispatch<SetStateAction<boolean>>;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(({ activeUserReport, className, setOpenUserReportCommentsForm }) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const appReportGroups = useAppReportGroups();
  const userToken = useAppUserToken();

  const onEditClick = useCallback(() => {
    setOpenUserReportCommentsForm(true);
  }, [setOpenUserReportCommentsForm]);

  const onDeleteClick = useCallback(async () => {
    if (!appReportGroups || !activeUserReport) return;

    try {
      const graphQlSdk = await getGraphQlSdk({ method: "POST" });

      const updateReportsResponse = await graphQlSdk.doUpdateReport({
        address: activeUserReport.address,
        description: null,
        latitude: activeUserReport.location.y,
        longitude: activeUserReport.location.x,
        permanent: activeUserReport.permanent,
        pk: activeUserReport.pk,
        reportType: activeUserReport.type.name,
        token: userToken,
        verified: activeUserReport.verified,
      });

      const updateReports = updateReportsResponse.updateReport;

      if (updateReports.errors) {
        dispatch({
          messageStringKey: "shared.toasts.commentEditFailed",
          messageType: "warning",
          type: "snackbarQueued",
        });

        logUpdateReportFail(router.asPath);
      } else {
        dispatch({ type: "reportsRefetchRequested" });

        logUpdateReportSuccess(router.asPath);

        dispatch({
          messageStringKey: "shared.toasts.commentEditSucceeded",
          messageType: "success",
          type: "snackbarQueued",
        });
      }
    } catch (error) {
      dispatch({
        messageStringKey: "shared.toasts.commentEditFailed",
        messageType: "warning",
        type: "snackbarQueued",
      });
    }
  }, [appReportGroups, activeUserReport, userToken, dispatch, router.asPath]);

  const options = useMemo(
    () => [
      {
        name: "Edit",
        onClick: onEditClick,
      },
      {
        name: "Delete",
        onClick: onDeleteClick,
      },
    ],
    [onDeleteClick, onEditClick],
  );
  return activeUserReport.description ? (
    <div css={reportDetails} className={className}>
      <div css={detailsContainer}>{activeUserReport.description}</div>
      <MenuOptionsOverlay horizontalAlignment="end" options={options} />
    </div>
  ) : null;
});

ActiveComments.displayName = "ActiveComments";

export default ActiveComments;
