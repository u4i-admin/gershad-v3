import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { memo, useCallback } from "react";

import HtmlContent from "src/components/HtmlContent";
import ChevronSvg from "src/components/icons/ChevronSvg";
import {
  logKyrChapterItemClick,
  logKyrSectionItemClick,
} from "src/utils/firebaseAnalytics";

export type KnowYourRightsListItemInfo = {
  description: string | null;
  id: number;
  title: string;
  url: string;
};

const container = css({
  alignItems: "center",
  columnGap: "0.5rem",
  display: "flex",
  justifyContent: "space-between",
  marginInlineStart: "-1rem",
  width: "calc(100% + 2rem)",
});

const icon = css({
  height: "1rem",
  minWidth: "1rem",
  width: "1rem",
});

const KnowYourRightsListItem: StylableFC<{
  info: KnowYourRightsListItemInfo;
}> = memo(({ info }) => {
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      const parts = info.url.split("/").filter((part) => part !== "");
      const sectionIndex = parts.indexOf("sections");

      if (sectionIndex < parts.length - 1) {
        logKyrSectionItemClick(info.id);
      } else if (sectionIndex === parts.length - 1) {
        logKyrChapterItemClick(info.id);
      }
    },
    [info],
  );

  return (
    <ListItemButton
      css={container}
      LinkComponent={Link}
      href={info.url}
      onClick={handleClick}
    >
      <Box>
        <Typography variant="headingH4">{info.title}</Typography>
        {info.description && (
          <HtmlContent dangerousHtml={info.description}></HtmlContent>
        )}
      </Box>
      <ChevronSvg css={icon} direction="end" />
    </ListItemButton>
  );
});

KnowYourRightsListItem.displayName = "KnowYourRightsListItem";

export default KnowYourRightsListItem;
