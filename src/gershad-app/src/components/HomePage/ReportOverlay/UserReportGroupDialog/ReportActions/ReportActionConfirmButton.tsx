import { StylableFC } from "@asl-19/react-dom-utils";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { Dispatch, memo, SetStateAction, useCallback, useMemo } from "react";

import CheckSvg from "src/components/icons/CheckSvg";
import { GqlReportGroup } from "src/generated/graphQl";
import useCreateReport from "src/hooks/useCreateReport";
import useCurrentDistance from "src/hooks/useCurrentDistanceAndIsInsideRange";
import { useAppStrings } from "src/stores/appStore";
import { reportActionIcon, reportActionItem } from "src/styles/reportStyles";
import { ReportOverlayState } from "src/types/reportTypes";

const ReportActionConfirmButton: StylableFC<{
  reportGroup: GqlReportGroup;
  setReportState: Dispatch<SetStateAction<ReportOverlayState>>;
}> = memo(({ reportGroup, setReportState }) => {
  const { shared: strings } = useAppStrings();

  const createReport = useCreateReport();

  const latLng: google.maps.LatLngLiteral = useMemo(
    () => ({
      lat: reportGroup.centroidLatitude,
      lng: reportGroup.centroidLongitude,
    }),
    [reportGroup.centroidLatitude, reportGroup.centroidLongitude],
  );

  const onConfirmClick = useCallback(async () => {
    const reportType = reportGroup.reports?.[0].type.name;

    if (!reportType) {
      setReportState({
        errorType: "unexpected",
        type: "hasErrorMessages",
      });
      return;
    }

    await createReport({
      latLng,
      reportType,
      setReportState,
    });
  }, [createReport, latLng, reportGroup.reports, setReportState]);

  const { currentUserIsInsideRange } = useCurrentDistance(latLng);

  return (
    <ButtonBase
      css={reportActionItem}
      disabled={!currentUserIsInsideRange}
      onClick={onConfirmClick}
    >
      <CheckSvg css={reportActionIcon} />
      <Typography variant="headingH5" component="span">
        {strings.button.confirm}
      </Typography>
    </ButtonBase>
  );
});

ReportActionConfirmButton.displayName = "ReportActionConfirmButton";

export default ReportActionConfirmButton;
