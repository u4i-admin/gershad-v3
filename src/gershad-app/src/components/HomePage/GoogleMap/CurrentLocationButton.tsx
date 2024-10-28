import { StylableFC } from "@asl-19/react-dom-utils";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import Fab from "@mui/material/Fab";
import { memo, useCallback } from "react";

import { googleMapButton } from "src/styles/googleMapStyles";
import { MuiSx } from "src/types/styleTypes";

const CurrentLocationButton: StylableFC<{
  disabled: boolean;
  onClick: () => void;
  sx?: MuiSx;
}> = memo(({ disabled, onClick, sx, ...remainingProps }) => {
  const onCurrentLocationButtonClick = useCallback(() => {
    // TODO: Disabled in favour of relying purely on
    // BackgroundGeolocation.watchPosition and Geolocation.watchPosition. Remove
    // later if not needed.

    // appDispatch({ type: "deviceLatLngUpdateRequested" });

    onClick();
  }, [onClick]);

  return (
    <Fab
      css={googleMapButton}
      onClick={onCurrentLocationButtonClick}
      size="small"
      disabled={disabled}
      sx={sx}
      {...remainingProps}
    >
      <LocationSearchingIcon />
    </Fab>
  );
});

CurrentLocationButton.displayName = "CurrentLocationButton";

export default CurrentLocationButton;
