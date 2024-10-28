import { StylableFC } from "@asl-19/react-dom-utils";
import { useTheme } from "@mui/material/styles";
import { Circle } from "@react-google-maps/api";
import { memo, useMemo } from "react";

import colors from "src/values/colors";

export const rangeCircleRadius = 1000;

const RangeCircle: StylableFC<{
  currentLatLng: google.maps.LatLngLiteral | undefined;
  fillColor?: string;
}> = memo(({ currentLatLng, fillColor }) => {
  const theme = useTheme();

  const circleDefaultOptions: google.maps.CircleOptions = useMemo(
    () => ({
      center: currentLatLng,
      clickable: false,
      draggable: false,
      editable: false,
      fillColor: fillColor ?? colors.grey,
      fillOpacity: 0.35,
      strokeColor: "transparent",
      visible: true,
      zIndex: theme.zIndex.rangeCircle_circleDefaultOptions,
    }),
    [currentLatLng, fillColor, theme.zIndex.rangeCircle_circleDefaultOptions],
  );
  return <Circle radius={rangeCircleRadius} options={circleDefaultOptions} />;
});

RangeCircle.displayName = "RangeCircle";

export default RangeCircle;
