import { useEffect, useState } from "react";

import { rangeCircleRadius } from "src/components/HomePage/GoogleMap/RangeCircle";
import {
  useAppDeviceIsMoving,
  useAppDeviceLatLng,
  useAppLocaleInfo,
} from "src/stores/appStore";
import formatNumber from "src/utils/formatNumber";

const useCurrentDistanceAndIsInsideRange = (
  destinationLocation: google.maps.LatLngLiteral,
) => {
  const deviceLatLng = useAppDeviceLatLng();
  const { localeCode } = useAppLocaleInfo();
  const deviceIsMoving = useAppDeviceIsMoving();

  const [currentDistance, setCurrentDistance] = useState<string | null>(null);
  const [currentUserIsInsideRange, setCurrentIsInsideRange] =
    useState<boolean>(false);

  useEffect(() => {
    const getCurrentDistance = async () => {
      const currentDistance = deviceLatLng
        ? window.google.maps.geometry?.spherical.computeDistanceBetween(
            deviceLatLng,
            {
              lat: destinationLocation.lat,
              lng: destinationLocation.lng,
            },
          )
        : null;

      const formattedDistance = currentDistance
        ? formatNumber({
            localeCode,
            number: currentDistance,
          })
        : null;

      setCurrentDistance(formattedDistance);
      setCurrentIsInsideRange(
        !!currentDistance && currentDistance < rangeCircleRadius,
      );
    };

    getCurrentDistance();
  }, [
    deviceLatLng,
    destinationLocation.lat,
    destinationLocation.lng,
    deviceIsMoving,
    localeCode,
  ]);

  return {
    currentDistance,
    currentUserIsInsideRange,
  };
};

export default useCurrentDistanceAndIsInsideRange;
