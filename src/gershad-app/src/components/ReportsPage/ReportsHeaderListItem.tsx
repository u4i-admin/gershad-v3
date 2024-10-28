import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import Link from "next/link";
import { memo, RefObject, useEffect, useRef } from "react";
import scrollIntoView from "scroll-into-view-if-needed";

import { useAppLocaleInfo } from "src/stores/appStore";
import { ReportFilterType } from "src/types/reportTypes";
import colors from "src/values/colors";

const buttonActive = css({
  background: colors.yellow,
  color: colors.black,
});

const buttonInactive = css({
  background: colors.grey,
  color: colors.white,
});

export type ReportTypeInfo = {
  name: string;
  slug: ReportFilterType;
  url: string;
};

const ReportsHeaderListItem: StylableFC<{
  isActive: boolean;
  listElementRef: RefObject<HTMLUListElement>;
  typeInfo: ReportTypeInfo;
}> = memo(({ isActive, listElementRef, typeInfo, ...remainingProps }) => {
  const { direction } = useAppLocaleInfo();

  const linkElementRef = useRef<HTMLAnchorElement>(null);

  // Scroll into view if active.
  //
  // We use scroll-into-view-if-needed over the native Element.scrollIntoView
  // so we can prevent the entire browser window from scrolling using its
  // `boundary` argument [1].
  //
  // If the user e.g. navigates back to an index page in which they were
  // scrolled down we want their scroll position to be retained.
  //
  // This will:
  //
  // 1. Scroll the active item into view on page load (important on mobile
  //    where if the active category is later in the list it could be active
  //    but completely outside of view, so the user might not know the a
  //    category filter is active).
  //
  // 2. Bring items into focus as they become active. So e.g. if the user
  //    clicks an item when it’s partially out of view it will fully scroll
  //    into view, and if the user navigates back/forward the newly active
  //    item will scroll into view).
  //
  // This is only enabled in RTL due to a bug in compute-scroll-into-view:
  //
  // - https://github.com/scroll-into-view/compute-scroll-into-view/issues/821
  // - https://github.com/scroll-into-view/scroll-into-view-if-needed/issues/993
  //
  // [1] (https://github.com/scroll-into-view/compute-scroll-into-view#boundary)
  useEffect(() => {
    if (isActive && linkElementRef.current && direction === "ltr") {
      scrollIntoView(linkElementRef.current, {
        boundary: listElementRef.current,
        inline: "end",
      });
    }
  }, [direction, isActive, listElementRef]);

  return (
    <li {...remainingProps}>
      <Button
        LinkComponent={Link}
        variant="contained"
        href={typeInfo.url}
        css={isActive ? buttonActive : buttonInactive}
        ref={linkElementRef}
      >
        {typeInfo.name}
      </Button>
    </li>
  );
});

ReportsHeaderListItem.displayName = "ReportsHeaderListItem";

export default ReportsHeaderListItem;
