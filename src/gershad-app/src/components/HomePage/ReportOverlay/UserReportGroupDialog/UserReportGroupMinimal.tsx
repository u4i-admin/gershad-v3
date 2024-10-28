import { replaceArabicNumeralsWithPersianNumerals } from "@asl-19/js-utils";
import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { memo, MouseEventHandler, useMemo } from "react";
import { match } from "ts-pattern";

import SmallCheckedSvg from "src/components/icons/SmallCheckedSvg";
import SmallLocationSvg from "src/components/icons/SmallLocationSvg";
import SmallTimeSvg from "src/components/icons/SmallTimeSvg";
import SegmentContainer from "src/components/SegmentContainer";
import { GqlReport, GqlReportGroup } from "src/generated/graphQl";
import useCurrentDistance from "src/hooks/useCurrentDistanceAndIsInsideRange";
import {
  useAppLocaleInfo,
  useAppStrings,
  useAppUserToken,
} from "src/stores/appStore";
import { lineClampedText } from "src/styles/generalStyles";
import { ReportType } from "src/types/reportTypes";
import getReportTypeInfo from "src/utils/getReportTypeInfo";
import colors from "src/values/colors";

export type UserReportGroupMinimalStrings = {
  /**
   * Text for number of reports suffix "times"
   */
  numberOfReportsSuffix: string;
  /**
   * Text for report distance suffix "away"
   */
  reportDistanceSuffix: string;
};

const container = css({
  background: "red",
  backgroundColor: colors.white,
  columnGap: "0.75rem",
  display: "flex",
  // maxWidth: "100% !important",
  // width: "100%",
});

const button = css({ width: "100%" });

const reportTypeDetail = css({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  padding: "0.5rem 0",
  rowGap: "0.5rem",
  width: "100%",
});

const reportTypeIcon = css({
  alignSelf: "center",
  flex: "0 1 auto",
  height: "4.5rem",
  minWidth: "4.375rem",
  width: "4.5rem",
});

const smallIcon = css({
  height: "0.9375rem",
  minHeight: "0.9375rem",
  transform: "translateY(-2px)",
});

const reportDetails = css({
  display: "flex",
  gap: "0.75rem",
  justifyContent: "start",
});

const reportDetailItem = css({
  alignItems: "center",
  color: colors.grey,
  display: "flex",
  gap: "0.25rem",
  minWidth: 0,
  whiteSpace: "nowrap",
});

const reportDetailText = css({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const addressLine = css(
  lineClampedText({
    fontSize: "0.9375rem",
    lineCount: 2,
    lineHeight: 1.4,
  }),
  {
    minHeight: "2.625rem",
  },
);

const UserReportGroupMinimal: StylableFC<
  (
    | {
        report?: never;
        reportGroup: GqlReportGroup;
      }
    | {
        report: GqlReport;
        reportGroup?: never;
      }
  ) &
    (
      | {
          href: string;
          onClick?: never;
        }
      | {
          href?: never;
          onClick: MouseEventHandler<HTMLButtonElement>;
        }
    )
> = memo(({ href, onClick, report, reportGroup, ...remainingProps }) => {
  const userToken = useAppUserToken();
  const { UserReportGroupMinimal: strings } = useAppStrings();
  const { localeCode } = useAppLocaleInfo();

  const { currentDistance } = useCurrentDistance(
    report
      ? {
          lat: report.location.y,
          lng: report.location.x,
        }
      : {
          lat: reportGroup.centroidLatitude,
          lng: reportGroup.centroidLongitude,
        },
  );

  const activeType = report
    ? report.type.name
    : reportGroup.reports?.find(
        (userReport) => userReport.token === userToken,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      )?.type.name ?? reportGroup?.reports![0].type.name;

  const isPermanent = (report ?? reportGroup).permanent;

  const { IconComponent, name } = getReportTypeInfo({
    isPermanent,
    localeCode,
    type: (activeType as ReportType) ?? "NS",
  });

  const timeCreated = useMemo(() => {
    const date = new Date(report ? report.modified : reportGroup.firstCreated);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return match(localeCode)
      .with("en", () => `${hours}:${minutes}`)
      .with("fa", () =>
        replaceArabicNumeralsWithPersianNumerals(`${hours}:${minutes}`),
      )
      .exhaustive();
  }, [localeCode, report, reportGroup]);

  const localeReportCount = reportGroup
    ? match(localeCode)
        .with("en", () => `${reportGroup.reportCount}`)
        .with("fa", () =>
          replaceArabicNumeralsWithPersianNumerals(
            `${reportGroup.reportCount}`,
          ),
        )
        .exhaustive()
    : null;

  const innerContent = useMemo(
    () => (
      <SegmentContainer css={container} padding="narrow">
        <IconComponent css={reportTypeIcon} />

        <div css={reportTypeDetail}>
          <Typography variant="headingH3" component="h2">
            {name}
          </Typography>

          <Typography variant="paraSmall" component="p" css={addressLine}>
            {(report ?? reportGroup.reports?.[0])?.address}
          </Typography>

          <div css={reportDetails}>
            <div css={reportDetailItem}>
              <SmallLocationSvg css={smallIcon} />
              <Typography
                css={reportDetailText}
                variant="paraSmall"
                component="p"
              >
                {currentDistance}&nbsp;{strings.reportDistanceSuffix}
              </Typography>
            </div>

            {!isPermanent && localeReportCount && (
              <div css={reportDetailItem}>
                <SmallCheckedSvg css={smallIcon} />
                <Typography
                  css={reportDetailText}
                  variant="paraSmall"
                  component="p"
                >
                  {localeReportCount}&nbsp;
                  {strings.numberOfReportsSuffix}
                </Typography>
              </div>
            )}

            <div css={reportDetailItem}>
              <SmallTimeSvg css={smallIcon} />
              <Typography
                css={reportDetailText}
                variant="paraSmall"
                component="p"
              >
                {timeCreated}
              </Typography>
            </div>
          </div>
        </div>
      </SegmentContainer>
    ),
    [
      IconComponent,
      name,
      report,
      reportGroup,
      currentDistance,
      strings.reportDistanceSuffix,
      strings.numberOfReportsSuffix,
      isPermanent,
      localeReportCount,
      timeCreated,
    ],
  );

  const sharedProps = useMemo(
    () => ({ css: button, ...remainingProps }),
    [remainingProps],
  );

  return href ? (
    <ButtonBase href={href} LinkComponent={Link} {...sharedProps}>
      {innerContent}
    </ButtonBase>
  ) : (
    <ButtonBase onClick={onClick} {...sharedProps}>
      {innerContent}
    </ButtonBase>
  );
});

UserReportGroupMinimal.displayName = "UserReportGroupMinimal";

export default UserReportGroupMinimal;
