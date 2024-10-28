import { GqlReportGroup } from "src/generated/graphQl";

export type ReportType =
  | "GASHT"
  | "VAN"
  | "STOP"
  | "REPFORCE"
  | "NS"
  | "UNSPECIFIED";

export type ReportFilterType = Exclude<ReportType, "NS"> | "PERMANENT" | "ALL";

export type ReportOverlayErrorType =
  | "noInternetConnection"
  | "invalid"
  | "unexpected";

export type ReportOverlayState =
  | { type: "isNotReporting" }
  | {
      action: "confirm" | "report";
      position: google.maps.LatLngLiteral;
      type: "isSelectingType";
    }
  | { type: "isSubmittingReport" }
  | {
      reportGroup: GqlReportGroup;
      type: "isDisplayingReport";
    }
  | {
      errorType: ReportOverlayErrorType;
      message?: string;
      type: "hasErrorMessages";
    };
