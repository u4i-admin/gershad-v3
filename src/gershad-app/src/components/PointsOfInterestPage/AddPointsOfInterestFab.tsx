import { StylableFC } from "@asl-19/react-dom-utils";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Link from "next/link";
import { memo } from "react";

import routeUrls from "src/routeUrls";
import { useAppStrings } from "src/stores/appStore";

export type AddPointsOfInterestFabStrings = {
  /**
   * Label text for a button for accessibility purposes
   */
  a11yLabel: string;
};

const AddPointsOfInterestFab: StylableFC = memo((props) => {
  const strings = useAppStrings();

  return (
    <Fab
      aria-label={strings.AddPointsOfInterestFab.a11yLabel}
      LinkComponent={Link}
      href={routeUrls.home({ bookmark: "true" })}
      {...props}
    >
      <AddIcon />
    </Fab>
  );
});

AddPointsOfInterestFab.displayName = "AddPointsOfInterestFab";

export default AddPointsOfInterestFab;
