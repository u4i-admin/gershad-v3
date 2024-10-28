import { StylableFC } from "@asl-19/react-dom-utils";
import { match, P } from "ts-pattern";

import PermanentSvg from "src/components/icons/PermanentSvg";
import PoliceSvg from "src/components/icons/PoliceSvg";
import RepForceSvg from "src/components/icons/RepForceSvg";
import StopCheckSvg from "src/components/icons/StopCheckSvg";
import VanSvg from "src/components/icons/VanSvg";
import stringsEn from "src/strings/stringsEn";
import stringsFa from "src/strings/stringsFa";
import { ReportType } from "src/types/reportTypes";
import { LocaleCode } from "src/values/localeValues";

export type ReportTypeInfo = {
  IconComponent: StylableFC;
  name: string;
};

const getReportTypeInfo = ({
  isPermanent,
  localeCode,
  type,
}: {
  isPermanent: boolean;
  localeCode: LocaleCode;
  type: ReportType;
}) =>
  match(type)
    .with("GASHT", () =>
      isPermanent
        ? {
            IconComponent: PermanentSvg,
            name:
              localeCode === "en"
                ? `${stringsEn.shared.reportTypes.permanent} (${stringsEn.shared.reportTypes.police})`
                : `${stringsFa.shared.reportTypes.permanent} (${stringsFa.shared.reportTypes.police})`,
          }
        : {
            IconComponent: PoliceSvg,
            name:
              localeCode === "en"
                ? stringsEn.shared.reportTypes.police
                : stringsFa.shared.reportTypes.police,
          },
    )
    .with("STOP", () =>
      isPermanent
        ? {
            IconComponent: PermanentSvg,
            name:
              localeCode === "en"
                ? `${stringsEn.shared.reportTypes.permanent} (${stringsEn.shared.reportTypes.stopCheck})`
                : `${stringsFa.shared.reportTypes.permanent} (${stringsFa.shared.reportTypes.stopCheck})`,
          }
        : {
            IconComponent: StopCheckSvg,
            name:
              localeCode === "en"
                ? stringsEn.shared.reportTypes.stopCheck
                : stringsFa.shared.reportTypes.stopCheck,
          },
    )
    .with("VAN", () =>
      isPermanent
        ? {
            IconComponent: PermanentSvg,
            name:
              localeCode === "en"
                ? `${stringsEn.shared.reportTypes.permanent} (${stringsEn.shared.reportTypes.van})`
                : `${stringsFa.shared.reportTypes.permanent} (${stringsFa.shared.reportTypes.van})`,
          }
        : {
            IconComponent: VanSvg,
            name:
              localeCode === "en"
                ? stringsEn.shared.reportTypes.van
                : stringsFa.shared.reportTypes.van,
          },
    )
    .with("REPFORCE", () =>
      isPermanent
        ? {
            IconComponent: PermanentSvg,
            name:
              localeCode === "en"
                ? `${stringsEn.shared.reportTypes.permanent} (${stringsEn.shared.reportTypes.repForce})`
                : `${stringsFa.shared.reportTypes.permanent} (${stringsFa.shared.reportTypes.repForce})`,
          }
        : {
            IconComponent: RepForceSvg,
            name:
              localeCode === "en"
                ? stringsEn.shared.reportTypes.repForce
                : stringsFa.shared.reportTypes.repForce,
          },
    )
    .with(
      "NS",
      "UNSPECIFIED",
      // Matching all strings to prevent runtime errors if a new report type is
      // added
      P.string,
      () => {
        console.warn(
          `[getReportTypeInfo] Received unexpected report type "${type}"`,
        );

        return isPermanent
          ? {
              IconComponent: PermanentSvg,
              name:
                localeCode === "en"
                  ? stringsEn.shared.reportTypes.permanent
                  : stringsFa.shared.reportTypes.permanent,
            }
          : {
              IconComponent: PermanentSvg,
              name:
                localeCode === "en"
                  ? stringsEn.shared.reportTypes.permanent
                  : stringsFa.shared.reportTypes.permanent,
            };
      },
    )
    .exhaustive();

export default getReportTypeInfo;
