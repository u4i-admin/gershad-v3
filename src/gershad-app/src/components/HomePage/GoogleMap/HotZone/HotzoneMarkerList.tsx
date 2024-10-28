import { StylableFC } from "@asl-19/react-dom-utils";
import { Dispatch, memo, SetStateAction } from "react";

import HotzoneMarker from "src/components/HomePage/GoogleMap/HotZone/HotzoneMarker";
import { GqlHotZoneCluster } from "src/generated/graphQl";

const HotzoneMarkerList: StylableFC<{
  activeInfoBox: string | null;
  hotzones: Array<GqlHotZoneCluster>;
  setActiveInfoBox: Dispatch<SetStateAction<string | null>>;
}> = memo(({ activeInfoBox, hotzones, setActiveInfoBox }) =>
  hotzones.map((hotzone) => (
    <HotzoneMarker
      hotzone={hotzone}
      key={hotzone.id}
      activeInfoBox={activeInfoBox}
      setActiveInfoBox={setActiveInfoBox}
    />
  )),
);

HotzoneMarkerList.displayName = "ReportMarker";

export default HotzoneMarkerList;
