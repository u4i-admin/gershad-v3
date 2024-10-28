import { StylableFC } from "@asl-19/react-dom-utils";
import { Marker } from "@react-google-maps/api";
import { Clusterer } from "@react-google-maps/marker-clusterer";
import { memo, useCallback, useMemo } from "react";
import { match, P } from "ts-pattern";

import { GqlReportGroup } from "src/generated/graphQl";
import gashtPng from "src/static/reports/gasht.png";
import gasht2Png from "src/static/reports/gasht2.png";
import gasht3Png from "src/static/reports/gasht3.png";
import gasht4Png from "src/static/reports/gasht4.png";
import gasht5Png from "src/static/reports/gasht5.png";
import gasht6Png from "src/static/reports/gasht6.png";
import gasht7Png from "src/static/reports/gasht7.png";
import gasht8Png from "src/static/reports/gasht8.png";
import gasht9Png from "src/static/reports/gasht9.png";
import gashtGt9Png from "src/static/reports/gashtGt9.png";
import permanentPng from "src/static/reports/permanent.png";
import repForcePng from "src/static/reports/repForce.png";
import repForce2Png from "src/static/reports/repForce2.png";
import repForce3Png from "src/static/reports/repForce3.png";
import repForce4Png from "src/static/reports/repForce4.png";
import repForce5Png from "src/static/reports/repForce5.png";
import repForce6Png from "src/static/reports/repForce6.png";
import repForce7Png from "src/static/reports/repForce7.png";
import repForce8Png from "src/static/reports/repForce8.png";
import repForce9Png from "src/static/reports/repForce9.png";
import repForceGt9Png from "src/static/reports/repForceGt9.png";
import stopPng from "src/static/reports/stop.png";
import stop2Png from "src/static/reports/stop2.png";
import stop3Png from "src/static/reports/stop3.png";
import stop4Png from "src/static/reports/stop4.png";
import stop5Png from "src/static/reports/stop5.png";
import stop6Png from "src/static/reports/stop6.png";
import stop7Png from "src/static/reports/stop7.png";
import stop8Png from "src/static/reports/stop8.png";
import stop9Png from "src/static/reports/stop9.png";
import stopGt9Png from "src/static/reports/stopGt9.png";
import vanPng from "src/static/reports/van.png";
import van2Png from "src/static/reports/van2.png";
import van3Png from "src/static/reports/van3.png";
import van4Png from "src/static/reports/van4.png";
import van5Png from "src/static/reports/van5.png";
import van6Png from "src/static/reports/van6.png";
import van7Png from "src/static/reports/van7.png";
import van8Png from "src/static/reports/van8.png";
import van9Png from "src/static/reports/van9.png";
import vanGt9 from "src/static/reports/vanGt9.png";

export type ReportMarkerReportCountAttribute = {
  reportCount: number;
};

const getMarkerIcon = ({ name, number }: { name: string; number: number }) =>
  match({ name, number })
    .with({ name: "GASHT", number: 1 }, () => gashtPng)
    .with({ name: "GASHT", number: 2 }, () => gasht2Png)
    .with({ name: "GASHT", number: 3 }, () => gasht3Png)
    .with({ name: "GASHT", number: 4 }, () => gasht4Png)
    .with({ name: "GASHT", number: 5 }, () => gasht5Png)
    .with({ name: "GASHT", number: 6 }, () => gasht6Png)
    .with({ name: "GASHT", number: 7 }, () => gasht7Png)
    .with({ name: "GASHT", number: 8 }, () => gasht8Png)
    .with({ name: "GASHT", number: 9 }, () => gasht9Png)
    .with({ name: "GASHT", number: P.number.gt(9) }, () => gashtGt9Png)
    .with({ name: "REPFORCE", number: 1 }, () => repForcePng)
    .with({ name: "REPFORCE", number: 2 }, () => repForce2Png)
    .with({ name: "REPFORCE", number: 3 }, () => repForce3Png)
    .with({ name: "REPFORCE", number: 4 }, () => repForce4Png)
    .with({ name: "REPFORCE", number: 5 }, () => repForce5Png)
    .with({ name: "REPFORCE", number: 6 }, () => repForce6Png)
    .with({ name: "REPFORCE", number: 7 }, () => repForce7Png)
    .with({ name: "REPFORCE", number: 8 }, () => repForce8Png)
    .with({ name: "REPFORCE", number: 9 }, () => repForce9Png)
    .with({ name: "REPFORCE", number: P.number.gt(9) }, () => repForceGt9Png)
    .with({ name: "STOP", number: 1 }, () => stopPng)
    .with({ name: "STOP", number: 2 }, () => stop2Png)
    .with({ name: "STOP", number: 3 }, () => stop3Png)
    .with({ name: "STOP", number: 4 }, () => stop4Png)
    .with({ name: "STOP", number: 5 }, () => stop5Png)
    .with({ name: "STOP", number: 6 }, () => stop6Png)
    .with({ name: "STOP", number: 7 }, () => stop7Png)
    .with({ name: "STOP", number: 8 }, () => stop8Png)
    .with({ name: "STOP", number: 9 }, () => stop9Png)
    .with({ name: "STOP", number: P.number.gt(9) }, () => stopGt9Png)
    .with({ name: "VAN", number: 1 }, () => vanPng)
    .with({ name: "VAN", number: 2 }, () => van2Png)
    .with({ name: "VAN", number: 3 }, () => van3Png)
    .with({ name: "VAN", number: 4 }, () => van4Png)
    .with({ name: "VAN", number: 5 }, () => van5Png)
    .with({ name: "VAN", number: 6 }, () => van6Png)
    .with({ name: "VAN", number: 7 }, () => van7Png)
    .with({ name: "VAN", number: 8 }, () => van8Png)
    .with({ name: "VAN", number: 9 }, () => van9Png)
    .with({ name: "VAN", number: P.number.gt(9) }, () => vanGt9)
    .otherwise(() => null);

const iconWidth = 60;
const iconHeight = 60;

const ReportMarker: StylableFC<{
  clusterer: Clusterer;
  onOpenUserReportGroupDialogClick: ({
    userReportGroup,
  }: {
    userReportGroup: GqlReportGroup;
  }) => void;
  userReportGroup: GqlReportGroup;
}> = memo(
  ({ clusterer, onOpenUserReportGroupDialogClick, userReportGroup }) => {
    const markerOptions = useMemo<
      (google.maps.MarkerOptions & ReportMarkerReportCountAttribute) | null
    >(() => {
      const url = userReportGroup.permanent
        ? permanentPng.src
        : match(userReportGroup?.reports?.[0].type.name)
            .with(
              P.string,
              (name) =>
                getMarkerIcon({
                  name,
                  number: userReportGroup.reportCount,
                })?.src ?? null,
            )
            .otherwise(() => null);

      if (!url) {
        console.warn(
          "Couldn’t determine marker icon URL for report group, so it won’t be rendered:",
          userReportGroup,
        );
        return null;
      }

      return {
        icon: {
          anchor: new google.maps.Point(iconWidth / 2, iconHeight / 2),
          size: new google.maps.Size(iconWidth, iconHeight),
          url,
        },
        opacity: userReportGroup.faded,
        reportCount: userReportGroup.reportCount,
      };
    }, [userReportGroup]);

    const position = useMemo(
      () => ({
        lat: userReportGroup.centroidLatitude,
        lng: userReportGroup.centroidLongitude,
      }),
      [userReportGroup.centroidLatitude, userReportGroup.centroidLongitude],
    );

    const onClick = useCallback(() => {
      onOpenUserReportGroupDialogClick({ userReportGroup });
    }, [onOpenUserReportGroupDialogClick, userReportGroup]);

    if (!markerOptions) {
      return null;
    }

    return (
      <Marker
        position={position}
        options={markerOptions}
        zIndex={2200000}
        onClick={onClick}
        clusterer={
          process.env.NEXT_PUBLIC_ENABLE_GOOGLE_MAP_CLUSTERER
            ? clusterer
            : undefined
        }
      />
    );
  },
);

ReportMarker.displayName = "ReportMarker";

export default ReportMarker;
