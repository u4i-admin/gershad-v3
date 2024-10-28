import { StylableFC } from "@asl-19/react-dom-utils";
import { Marker } from "@react-google-maps/api";
import { memo, useMemo } from "react";

import { GqlPointOfInterest } from "src/generated/graphQl";
import bookmarkedPng from "src/static/icons/bookmarkedIcon.png";

const PointOfInterestMarkerListItem: StylableFC<{
  location: GqlPointOfInterest;
}> = memo(({ location }) => {
  const markerOptions: google.maps.MarkerOptions = useMemo(
    () => ({
      icon: {
        url: bookmarkedPng.src,
      },
    }),
    [],
  );

  const position: google.maps.LatLngLiteral = useMemo(
    () => ({
      lat: location.location.y,
      lng: location.location.x,
    }),
    [location],
  );
  return (
    <Marker position={position} key={location.id} options={markerOptions} />
  );
});

PointOfInterestMarkerListItem.displayName = "PointOfInterestMarkerListItem";

export default PointOfInterestMarkerListItem;
