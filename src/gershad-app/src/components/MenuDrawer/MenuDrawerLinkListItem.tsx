import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { memo, MouseEventHandler } from "react";
import { match, P } from "ts-pattern";

import { menuDrawerContentPaddingInlineStart } from "src/components/MenuDrawer/menuDrawerValues";
import routeUrls from "src/routeUrls";
import {
  logNavAboutClick,
  logNavFaqClick,
  logNavFeedbackEmailClick,
  logNavKyrClick,
  logNavSettingsClick,
} from "src/utils/firebaseAnalytics";
import colors from "src/values/colors";

export type MenuDrawerLinkListItemInfo =
  | {
      IconComponent: StylableFC;
      href: string;
      onClick?: never;
      text: string;
    }
  | {
      IconComponent: StylableFC;
      href?: string;
      onClick: MouseEventHandler<HTMLElement>;
      text: string;
    };

const listItemButton = css(
  { display: "flex" },
  {
    paddingInlineStart: menuDrawerContentPaddingInlineStart,
  },
);

const listItemIcon = css({
  height: "1.5rem",
  width: "1.5rem",
});

const icon = css({
  color: colors.darkGrey,
});

const MenuDrawerLinkListItem: StylableFC<{
  closeMenuDrawer: () => void;
  itemInfo: MenuDrawerLinkListItemInfo;
}> = memo(({ closeMenuDrawer, itemInfo }) => {
  const IconComponent = itemInfo.IconComponent;

  const href = itemInfo.href ?? "";

  const handleCloseMenuDrawer = () => {
    closeMenuDrawer();

    if (itemInfo.href === routeUrls.settings()) {
      logNavSettingsClick(itemInfo.href);
    } else if (itemInfo.href === routeUrls.about()) {
      logNavAboutClick(itemInfo.href);
    } else if (itemInfo.href === routeUrls.faqs()) {
      logNavFaqClick(itemInfo.href);
    } else if (itemInfo.href === routeUrls.knowYourRights()) {
      logNavKyrClick(itemInfo.href);
    } else if (
      itemInfo.href ===
      `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL_ADDRESS}`
    ) {
      logNavFeedbackEmailClick(itemInfo.href);
    }
  };

  return (
    <ListItem disablePadding>
      {match(itemInfo)
        .with({ href: P.string }, () => (
          <ListItemButton
            onClick={handleCloseMenuDrawer}
            css={listItemButton}
            LinkComponent={Link}
            href={href}
          >
            <ListItemIcon css={listItemIcon}>
              <IconComponent css={icon} />
            </ListItemIcon>

            <ListItemText disableTypography primary={itemInfo.text} />
          </ListItemButton>
        ))
        .with({ onClick: P.not(undefined) }, (linkInfo) => (
          <ListItemButton css={listItemButton} onClick={linkInfo.onClick}>
            <ListItemIcon css={listItemIcon}>
              <IconComponent css={icon} />
            </ListItemIcon>

            <ListItemText disableTypography primary={itemInfo.text} />
          </ListItemButton>
        ))
        .exhaustive()}
    </ListItem>
  );
});

MenuDrawerLinkListItem.displayName = "MenuDrawerLinkListItem";

export default MenuDrawerLinkListItem;
