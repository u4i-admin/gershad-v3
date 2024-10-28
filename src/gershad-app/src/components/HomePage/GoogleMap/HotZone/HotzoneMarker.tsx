import { replaceArabicNumeralsWithPersianNumerals } from "@asl-19/js-utils";
import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Marker } from "@react-google-maps/api";
import { InfoWindow } from "@react-google-maps/api";
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { match } from "ts-pattern";

import HotzoneLevel from "src/components/HomePage/GoogleMap/HotZone/HotzoneLevel";
import ReportTypeCountList from "src/components/HomePage/GoogleMap/HotZone/ReportTypeCountList";
import InformationSvg from "src/components/icons/InformationSvg";
import WarningSvg from "src/components/icons/WarningSvg";
import { GqlHotZoneCluster } from "src/generated/graphQl";
import { useAppStrings } from "src/stores/appStore";
import { MuiSx } from "src/types/styleTypes";
import getFormattedAddress from "src/utils/googlemaps/getFormattedAddress";
import colors from "src/values/colors";

const iconWidth = 60;
const iconHeight = 60;

export type HotzoneMarkerStrings = {
  /**
   * Text for Total Report
   */
  totalReports: string;
};

const infoWindowOptions: google.maps.InfoWindowOptions = {
  maxWidth: 220,
  minWidth: 220,
};

const container = css({
  alignItems: "center",
  backgroundColor: colors.white,
  borderRadius: "0.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  padding: "0.5rem",
  width: "100%",
});

const tooltipSlotProps: TooltipProps["slotProps"] = {
  popper: {
    disablePortal: true,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -16],
        },
      },
    ],
  },
};

const levelContainer = css({
  alignItems: "center",
  display: "flex",
  gap: "0.5rem",
});
const warningIconContainer = css({
  alignItems: "center",
  backgroundColor: colors.orange,
  borderRadius: "50%",
  display: "flex",
  height: "1.5rem",
  justifyContent: "center",
  width: "1.5rem",
});
const warningIcon = css({
  height: "0.75rem",
  transform: "translateY(-1px)",
  width: "0.75rem",
});
const informationIcon = css({
  height: "1.5rem",
  width: "1.5rem",
});
const totalReportsText = css({
  fontSize: "10px",
});
const areaName = css({
  fontSize: "0.75rem",
  textAlign: "center",
});
const infoText = css({
  whiteSpace: "pre-line",
});
const iconButton: MuiSx = {
  "& .MuiTouchRipple-root": {
    color: "transparent",
  },
};

const markerHighestOpacity = 1;

const markerLowestOpacity = 0.3;

/**
 * Step between marker opacity levels.
 */
const markerOpacityStep = (markerHighestOpacity - markerLowestOpacity) / 4;

const HotzoneMarker: StylableFC<{
  activeInfoBox: string | null;
  hotzone: GqlHotZoneCluster;
  setActiveInfoBox: Dispatch<SetStateAction<string | null>>;
}> = memo(({ activeInfoBox, hotzone, setActiveInfoBox }) => {
  const { HotzoneMarker: strings } = useAppStrings();
  const [formattedAddress, setFormattedAddress] = useState<string | null>("");

  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

  const position = useMemo(
    () => ({
      lat: hotzone.centroidLocation.y,
      lng: hotzone.centroidLocation.x,
    }),
    [hotzone],
  );

  const hotzoneLevelOpacity = match(hotzone.hotzoneLevel)
    .with(
      5,
      4,
      3,
      2,
      1,
      (hotzoneLevel) =>
        markerLowestOpacity + (hotzoneLevel - 1) * markerOpacityStep,
    )
    .otherwise((hotzoneLevel) => {
      console.warn(
        `Encountered unexpected hotzoneLevel ${hotzoneLevel} (expected to be between 1-5)!`,
      );
      return 0;
    });

  const urlSvg = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="30" fill="${colors.orange}" fill-opacity="${hotzoneLevelOpacity}"/>
        <path
          fill="#fff"
          d="M31.0568 33.4528c0 .6829-.5463 1.2427-1.2427 1.2427-.6965 0-1.2427-.5598-1.2427-1.2427 0-.6827.5462-1.2426 1.2427-1.2426.6964 0 1.2427.5599 1.2427 1.2426Zm-.6732-2.4853h-1.152a.3194.3194 0 0 1-.3191-.3048l-.2439-5.3286A.3195.3195 0 0 1 28.9878 25h1.6518a.3194.3194 0 0 1 .3191.3348l-.256 5.3286a.3195.3195 0 0 1-.3191.3041Z"
        />
    </svg>`,
  )}`;

  const markerOptions = useMemo<google.maps.MarkerOptions>(
    () => ({
      icon: {
        anchor: new google.maps.Point(iconWidth / 2, iconHeight / 2),
        scaledSize: new google.maps.Size(iconWidth, iconHeight),
        size: new google.maps.Size(iconWidth, iconHeight),
        url: urlSvg,
      },
    }),
    [urlSvg],
  );

  const onMarkerClick = useCallback(() => {
    setActiveInfoBox(hotzone.id);
  }, [hotzone.id, setActiveInfoBox]);

  const onInfoWindowUnmountOrClose = useCallback(() => {
    setTooltipIsOpen(false);
    setActiveInfoBox(null);
  }, [setActiveInfoBox]);

  useEffect(() => {
    const getAddress = async () => {
      const address = await getFormattedAddress(position);

      setFormattedAddress(address);
    };

    getAddress();
  }, [position]);

  const markerOpacity = (hotzone.hotzoneLevel / 5) * 2;

  //TODO replace text from backend
  const infoDescription =
    "\nLorem Ipsum is simply dummy text of the \n printing and typesetting industry";

  const infoContainer = useMemo(
    () => (
      <Typography component="p" variant="paraExtraSmallRegular" css={infoText}>
        {infoDescription}
      </Typography>
    ),
    [],
  );

  const handleTooltipClose = useCallback(() => {
    setTooltipIsOpen(false);
  }, []);

  const handleTooltipOpen = useCallback(() => {
    setTooltipIsOpen(true);
  }, []);

  const totalReportsCount = replaceArabicNumeralsWithPersianNumerals(
    `${hotzone.totalReportsCount}`,
  );

  return (
    <>
      <Marker
        position={position}
        options={markerOptions}
        zIndex={2200000}
        onClick={onMarkerClick}
        opacity={markerOpacity}
      >
        {activeInfoBox === hotzone.id ? (
          <InfoWindow
            onCloseClick={onInfoWindowUnmountOrClose}
            options={infoWindowOptions}
            onUnmount={onInfoWindowUnmountOrClose}
          >
            <div css={container}>
              <Typography component="p" css={areaName}>
                {formattedAddress}
              </Typography>
              <div css={levelContainer}>
                <div css={warningIconContainer}>
                  <WarningSvg color={colors.white} css={warningIcon} />
                </div>
                <HotzoneLevel level={hotzone.hotzoneLevel} />
                {/* Based on https://mui.com/material-ui/react-tooltip/#triggers */}
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <Tooltip
                    arrow
                    title={infoContainer}
                    slotProps={tooltipSlotProps}
                    open={tooltipIsOpen}
                    onClose={handleTooltipClose}
                    placement="bottom"
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                  >
                    <IconButton sx={iconButton} onClick={handleTooltipOpen}>
                      <InformationSvg css={informationIcon} />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
              </div>
              {hotzone.countPerType && (
                <ReportTypeCountList reportTypeCounts={hotzone.countPerType} />
              )}

              <div css={totalReportsText}>
                {strings.totalReports}&nbsp;{totalReportsCount}
              </div>
            </div>
          </InfoWindow>
        ) : null}
      </Marker>
    </>
  );
});

HotzoneMarker.displayName = "ReportMarker";

export default HotzoneMarker;
