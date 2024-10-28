import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { memo, useMemo, useRef } from "react";

import OverflowIndicatorWrapper from "src/components/OverflowIndicatorWrapper";
import ReportsHeaderListItem from "src/components/ReportsPage/ReportsHeaderListItem";
import SegmentContainer from "src/components/SegmentContainer";
import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";
import {
  hiddenWhenPointerCoarseOrNone,
  hiddenWhenPointerFine,
} from "src/styles/generalStyles";
import { ReportFilterType } from "src/types/reportTypes";

const list = css({
  display: "flex",
  gap: "0.5rem",
  overflowX: "auto",
  paddingBlock: "0.5rem",
  width: "100%",
});

const pointerCoarseOverflowIndicatorWrapper = hiddenWhenPointerFine;

const pointerCoarseList = css(list, {
  "::-webkit-scrollbar": {
    display: "none",
  },
});

const pointerFineList = css(list, hiddenWhenPointerCoarseOrNone, {
  flexWrap: "wrap",
});

const reportsHeaderListItem = css({
  flex: "0 0 auto",
});

export type ReportTypeInfo = {
  name: string;
  slug: ReportFilterType;
  url: string;
};

const ReportsHeader: StylableFC<{
  activeReportFilterType: ReportFilterType;
}> = memo(({ activeReportFilterType: activeType, ...remainingProps }) => {
  const { shared: strings } = useAppStrings();

  const pointerCoarseListElementRef = useRef<HTMLUListElement>(null);

  const reportTypeInfos: Array<ReportTypeInfo> = useMemo(
    () => [
      {
        name: strings.reportTypes.all,
        slug: "ALL",
        url: routeUrls.reports(),
      },
      {
        name: strings.reportTypes.permanent,
        slug: "PERMANENT",
        url: routeUrls.reports({ reportType: "PERMANENT" }),
      },
      {
        name: strings.reportTypes.van,
        slug: "VAN",
        url: routeUrls.reports({ reportType: "VAN" }),
      },
      {
        name: strings.reportTypes.police,
        slug: "GASHT",
        url: routeUrls.reports({ reportType: "GASHT" }),
      },
      {
        name: strings.reportTypes.stopCheck,
        slug: "STOP",
        url: routeUrls.reports({ reportType: "STOP" }),
      },
      {
        name: strings.reportTypes.repForce,
        slug: "REPFORCE",
        url: routeUrls.reports({ reportType: "REPFORCE" }),
      },
    ],
    [strings],
  );

  const listNavListItems = reportTypeInfos.map((type) => (
    <ReportsHeaderListItem
      css={reportsHeaderListItem}
      typeInfo={type}
      isActive={type.slug === activeType}
      listElementRef={pointerCoarseListElementRef}
      key={type.slug}
    />
  ));

  return (
    <SegmentContainer padding="narrow">
      <OverflowIndicatorWrapper
        css={pointerCoarseOverflowIndicatorWrapper}
        {...remainingProps}
      >
        <ul css={pointerCoarseList} ref={pointerCoarseListElementRef}>
          {listNavListItems}
        </ul>
      </OverflowIndicatorWrapper>

      <ul css={pointerFineList}>{listNavListItems}</ul>
    </SegmentContainer>
  );
});

ReportsHeader.displayName = "ReportsHeader";

export default ReportsHeader;
