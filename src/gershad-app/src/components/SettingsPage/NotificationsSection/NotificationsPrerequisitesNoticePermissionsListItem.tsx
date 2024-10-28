import { StylableFC } from "@asl-19/react-dom-utils";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { memo } from "react";

import { useAppStrings } from "src/stores/appStore";

export type NotificationsPrerequisitesNoticeListItemStrings = {
  disabledA11yLabel: string;
  enabledAllyLabel: string;
};

const NotificationsPrerequisitesNoticeListItem: StylableFC<{
  isEnabled: boolean | undefined;
  text: string;
}> = memo(({ isEnabled, text, ...remainingProps }) => {
  const strings = useAppStrings();

  return (
    <ListItem {...remainingProps}>
      <ListItemIcon
        aria-label={
          isEnabled
            ? strings.NotificationsPrerequisitesNoticeListItem.enabledAllyLabel
            : strings.NotificationsPrerequisitesNoticeListItem.disabledA11yLabel
        }
      >
        {isEnabled ? "✔️" : "❌"}
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItem>
  );
});

NotificationsPrerequisitesNoticeListItem.displayName =
  "NotificationsPrerequisitesNoticeListItem";

export default NotificationsPrerequisitesNoticeListItem;
