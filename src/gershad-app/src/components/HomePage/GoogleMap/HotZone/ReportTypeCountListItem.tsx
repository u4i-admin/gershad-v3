import { replaceArabicNumeralsWithPersianNumerals } from "@asl-19/js-utils";
import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import { memo } from "react";

import { GqlReportsTypeCount } from "src/generated/graphQl";
import { useAppLocaleInfo } from "src/stores/appStore";
import { ReportType } from "src/types/reportTypes";
import getReportTypeInfo from "src/utils/getReportTypeInfo";
import colors from "src/values/colors";

const icon = css({
  height: "2rem",
  width: "2rem",
});
const text = css({
  fontSize: "0.5rem",
});
const container = css({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
});
const count = css({
  backgroundColor: colors.orange,
  borderRadius: "50%",
  color: colors.white,
  display: "flex",
  height: "1rem",
  insetInlineEnd: 0,
  justifyContent: "center",
  position: "absolute",
  top: "-5px",
  width: "1rem",
});

const countText = css({
  fontSize: "0.6rem",
  lineHeight: "1.1rem",
});
const iconContainer = css({
  position: "relative",
});

const ReportTypeCountListItem: StylableFC<{
  reportTypeCount: GqlReportsTypeCount;
}> = memo(({ reportTypeCount }) => {
  const { localeCode } = useAppLocaleInfo();

  const { IconComponent, name } = getReportTypeInfo({
    isPermanent: false,
    localeCode,
    type: (reportTypeCount.reportType as ReportType) ?? "NS",
  });
  if (reportTypeCount.reportsCount === 0) {
    return null;
  }

  const reportsCount = replaceArabicNumeralsWithPersianNumerals(
    `${reportTypeCount.reportsCount}`,
  );

  return (
    <div css={container}>
      <div css={iconContainer}>
        <IconComponent css={icon} />
        <div css={count}>
          <Typography css={countText}>{reportsCount}</Typography>
        </div>
      </div>
      <Typography css={text}>{name}</Typography>
    </div>
  );
});

ReportTypeCountListItem.displayName = "ReportMarker";

export default ReportTypeCountListItem;
