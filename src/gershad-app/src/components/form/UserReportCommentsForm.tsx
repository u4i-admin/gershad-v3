import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import {
  Dispatch,
  FormEvent,
  memo,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";

import FormTextAreaAutosize from "src/components/form/FormTextAreaAutosize";
import LoadingOverlay from "src/components/LoadingOverlay";
import { GqlReport } from "src/generated/graphQl";
import {
  useAppDispatch,
  useAppReportGroups,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import { ReportOverlayState } from "src/types/reportTypes";
import getGraphQlSdk from "src/utils/config/getGraphQlSdk";
import {
  logUpdateReportFail,
  logUpdateReportSuccess,
} from "src/utils/firebaseAnalytics";
import colors from "src/values/colors";

export type UserReportCommentsFormStrings = {
  /**
   * Placeholder text for a textarea.
   * This prompts users input their comments: `Add comment`
   */
  commentTextAreaPlaceholder: string;
};

// ==============
// === Styles ===
// ==============
const formContainer = css({ display: "flex", flexDirection: "column" });

const inputContainer = css({ flexGrow: 1, padding: "1rem" });

const submitButton = css({
  // TODO: Remove backgroundColor and color once we set better default MUI
  // palette colors?
  backgroundColor: `${colors.yellow} !important`,
  color: colors.black,
  height: "3.75rem",
  lineHeight: "3.25rem",
  width: "100%",
});

// name variables
const passwordInputId = "UserReportCommentsForm-password";

const UserReportCommentsForm: StylableFC<{
  activeUserReport: GqlReport;
  onCloseReportFormCommentClick: () => void;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(({ activeUserReport, className, setReportState }) => {
  const dispatch = useAppDispatch();
  const appReportGroups = useAppReportGroups();
  const strings = useAppStrings();
  const userToken = useAppUserToken();

  const [comments, setComment] = useState(activeUserReport.description ?? "");

  const [formState, setFormState] = useState<
    "isNotSubmitting" | "isSubmitting"
  >("isNotSubmitting");

  const containerRef = useRef<HTMLButtonElement>(null);

  const onAddCommentFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setFormState("isSubmitting");

      if (!appReportGroups || !activeUserReport) return;

      try {
        const graphQlSdk = await getGraphQlSdk({ method: "POST" });
        const updateReportsResponse = await graphQlSdk.doUpdateReport({
          address: activeUserReport.address,
          description: comments,
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
          console.error(
            "[UserReportCommentsForm] Error:",
            updateReports.errors,
          );

          setFormState("isNotSubmitting");

          dispatch({
            messageStringKey: "shared.toasts.commentEditFailed",
            messageType: "warning",
            offsetElement: containerRef.current,
            type: "snackbarQueued",
          });

          logUpdateReportFail();
        }

        dispatch({ type: "reportsRefetchRequested" });

        dispatch({
          messageStringKey: "shared.toasts.commentEditSucceeded",
          messageType: "success",
          type: "snackbarQueued",
        });

        setReportState({ type: "isNotReporting" });

        logUpdateReportSuccess();
      } catch (error) {
        setFormState("isNotSubmitting");

        dispatch({
          messageStringKey: "shared.toasts.commentEditFailed",
          messageType: "warning",
          offsetElement: containerRef.current,
          type: "snackbarQueued",
        });

        logUpdateReportFail();
      }
    },
    [
      appReportGroups,
      activeUserReport,
      comments,
      userToken,
      dispatch,
      setReportState,
    ],
  );

  return (
    <form
      className={className}
      css={formContainer}
      onSubmit={onAddCommentFormSubmit}
    >
      {formState === "isSubmitting" && <LoadingOverlay />}

      <FormControl css={inputContainer}>
        <FormTextAreaAutosize
          placeholder={
            strings.UserReportCommentsForm.commentTextAreaPlaceholder
          }
          id={passwordInputId}
          required
          value={comments}
          setValue={setComment}
        />
      </FormControl>

      <Button
        css={submitButton}
        type="submit"
        disabled={comments.length === 0 || formState === "isSubmitting"}
        ref={containerRef}
      >
        <Typography variant="paraLarge" component="p">
          {strings.shared.button.submit}
        </Typography>
      </Button>
    </form>
  );
});
UserReportCommentsForm.displayName = "UserReportCommentsForm";
export default UserReportCommentsForm;
