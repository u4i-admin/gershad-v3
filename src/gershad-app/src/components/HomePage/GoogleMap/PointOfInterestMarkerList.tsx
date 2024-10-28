import { StylableFC } from "@asl-19/react-dom-utils";
import { memo } from "react";

import PointOfInterestMarkerListItem from "src/components/HomePage/GoogleMap/PointOfInterestMarkerListItem";
import { useAppPointOfInterests } from "src/stores/appStore";

const PointOfInterestMarkerList: StylableFC = memo(() => {
  const pointsOfInterest = useAppPointOfInterests();

  return (
    <>
      {pointsOfInterest.map((location) => (
        <PointOfInterestMarkerListItem location={location} key={location.id} />
      ))}
    </>
  );
});

PointOfInterestMarkerList.displayName = "PointOfInterestMarkerList";

export default PointOfInterestMarkerList;
