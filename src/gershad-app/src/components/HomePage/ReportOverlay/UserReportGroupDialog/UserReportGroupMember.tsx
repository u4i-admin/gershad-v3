import { replaceArabicNumeralsWithPersianNumerals } from "@asl-19/js-utils";
import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { memo, useMemo } from "react";
import { match } from "ts-pattern";

import SmallTimeSvg from "src/components/icons/SmallTimeSvg";
import { GqlReport } from "src/generated/graphQl";
import { useAppLocaleInfo, useAppStrings } from "src/stores/appStore";
import { ReportType } from "src/types/reportTypes";
import getReportTypeInfo from "src/utils/getReportTypeInfo";
import colors from "src/values/colors";

const detailItem = css({
  width: "100%",
});

const reportTypeIconAndName = css({
  alignItems: "center",
  display: "flex",
  gap: "0.5rem",
});
const reportTypeIcon = css({ height: "2.75rem" });

const reportTime = css({
  alignItems: "center",
  color: colors.grey,
  display: "flex",
  gap: "0.5rem",
});
const reportTimeSvg = css({ height: "0.9375rem" });

const reportDescriptionContainer = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  whiteSpace: "pre-line",
});

const reportNameAndTime = css({
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  padding: "1rem 0",
  width: "100%",
});

const UserReportGroupMember: StylableFC<{
  userReport: GqlReport;
}> = memo(({ userReport: { description, modified, permanent, type } }) => {
  const { UserReportGroupMembers: strings } = useAppStrings();
  const { localeCode } = useAppLocaleInfo();
  const { IconComponent, name } = getReportTypeInfo({
    isPermanent: permanent,
    localeCode,
    type: type.name as ReportType,
  });

  const lastUpdatedTime = useMemo(() => {
    if (modified === "") return "now";

    const date = new Date(modified);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return match(localeCode)
      .with("en", () => `${hours}:${minutes}`)
      .with("fa", () =>
        replaceArabicNumeralsWithPersianNumerals(`${hours}:${minutes}`),
      )
      .exhaustive();
  }, [modified, localeCode]);

  return (
    <Box css={detailItem}>
      <div css={reportNameAndTime}>
        <div css={reportTypeIconAndName}>
          <IconComponent css={reportTypeIcon} />
          <Typography variant="paraSmall" component="h4">
            {name}
          </Typography>
        </div>

        <div css={reportTime}>
          <SmallTimeSvg css={reportTimeSvg} />
          {lastUpdatedTime}
        </div>
      </div>

      {description && (
        <div css={reportDescriptionContainer}>
          <Typography variant="headingH4" component="h4">
            {strings.description}
          </Typography>
          <Typography variant="paraSmall" component="p">
            {description}
          </Typography>
        </div>
      )}
    </Box>
  );
});

UserReportGroupMember.displayName = "UserReportGroupMember";

export default UserReportGroupMember;
