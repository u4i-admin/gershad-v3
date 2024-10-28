import { StylableFC } from "@asl-19/react-dom-utils";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { memo, MouseEventHandler, useCallback, useMemo } from "react";

import ShareSvg from "src/components/icons/ShareSvg";
import { GqlReportGroup } from "src/generated/graphQl";
import { useAppStrings } from "src/stores/appStore";
import { reportActionIcon, reportActionItem } from "src/styles/reportStyles";
import { logShareReport } from "src/utils/firebaseAnalytics";
import shareLocation from "src/utils/shareLocation";

const ReportActionShareButton: StylableFC<{
  userReportGroup: GqlReportGroup;
}> = memo(({ userReportGroup: { centroidLatitude, centroidLongitude } }) => {
  const { shared: strings } = useAppStrings();
  const router = useRouter();

  const position: google.maps.LatLngLiteral = useMemo(
    () => ({
      lat: centroidLatitude,
      lng: centroidLongitude,
    }),
    [centroidLatitude, centroidLongitude],
  );

  const onShareClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(async () => {
    shareLocation({ location: position });

    logShareReport(router.asPath);
  }, [position, router.asPath]);

  return (
    <ButtonBase css={reportActionItem} onClick={onShareClick}>
      <ShareSvg css={reportActionIcon} />
      <Typography variant="headingH5" component="span">
        {strings.button.share}
      </Typography>
    </ButtonBase>
  );
});

ReportActionShareButton.displayName = "ReportActionShareButton";

export default ReportActionShareButton;
