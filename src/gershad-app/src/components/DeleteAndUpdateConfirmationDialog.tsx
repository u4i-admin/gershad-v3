import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Dispatch, memo, SetStateAction, useCallback } from "react";

import { useAppStrings } from "src/stores/appStore";
import { confirmDialogContainer } from "src/styles/dialogStyles";

export type DeleteAndUpdateConfirmationDialogStrings = {
  actions: {
    /**
     * Button text `Cancel` to cancel action
     */
    cancel: string;
    /**
     * Button text `Delete` to delete report/bookmarked location
     */
    delete: string;
    /**
     * Button text `Update` to update app version
     */
    update: string;
  };
};

const actionsContainer = css({
  display: "flex",
  justifyContent: "space-around",
});

const DeleteAndUpdateConfirmationDialog: StylableFC<{
  actionType?: "delete" | "update";
  description: string;
  onConfirmClick: () => void;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}> = memo(
  ({
    actionType = "delete",
    className,
    description,
    onConfirmClick,
    openDialog,
    setOpenDialog,
  }) => {
    const strings = useAppStrings();

    const onCloseClick = useCallback(() => {
      setOpenDialog(false);
    }, [setOpenDialog]);

    const onDialogConfirmClick = useCallback(() => {
      onConfirmClick();
      setOpenDialog(false);
    }, [onConfirmClick, setOpenDialog]);

    return (
      <Dialog
        onClose={onCloseClick}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        css={confirmDialogContainer}
        className={className}
      >
        <DialogContent>
          <Typography variant="paraMedium" component="p">
            {description}
          </Typography>
        </DialogContent>
        <DialogActions css={actionsContainer}>
          <Button onClick={onDialogConfirmClick} variant="contained">
            {actionType === "delete"
              ? strings.DeleteAndUpdateConfirmationDialog.actions.delete
              : strings.DeleteAndUpdateConfirmationDialog.actions.update}
          </Button>
          <Button onClick={onCloseClick} variant="text">
            {strings.DeleteAndUpdateConfirmationDialog.actions.cancel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

DeleteAndUpdateConfirmationDialog.displayName =
  "DeleteAndUpdateConfirmationDialog";

export default DeleteAndUpdateConfirmationDialog;
