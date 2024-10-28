import constate from "constate";
import { MutableRefObject, useReducer } from "react";
import { match } from "ts-pattern";

import reducerLog from "src/utils/store/reducerLog";

// =============
// === Types ===
// =============

export type MapState = {
  boundsHaveChangedFromInitial: boolean;
  googleMapRef: MutableRefObject<google.maps.Map | null>;
  isInitializing: boolean;
  mapLatLngIsInsideDeviceRangeCircle: boolean;
};

// Add actions here:
export type MapAction =
  | {
      type: "boundsChangedFromInitial";
    }
  | {
      isInsideDeviceRangeCircle: boolean;
      type: "mapLatLngChanged";
    };

// ===============
// === Reducer ===
// ==============='

const appReducer = (state: MapState, action: MapAction) => {
  const newState = match<MapAction, MapState>(action)
    .with({ type: "boundsChangedFromInitial" }, () => ({
      ...state,
      boundsHaveChangedFromInitial: true,
    }))
    .with({ type: "mapLatLngChanged" }, ({ isInsideDeviceRangeCircle }) => ({
      ...state,
      mapLatLngIsInsideDeviceRangeCircle: isInsideDeviceRangeCircle,
    }))
    .exhaustive();

  reducerLog({
    action,
    newState,
    state,
    storeName: "map",
  });

  return newState;
};

const useMap = ({ initialState }: { initialState: MapState }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return { dispatch, state };
};

export const [
  MapProvider,
  useMapDispatch,
  useMapBoundsHaveChangedFromInitial,
  useMapGoogleMapRef,
  useMapLatLngIsInsideDeviceRangeCircle,
] = constate(
  useMap,
  (value) => value.dispatch,
  (value) => value.state.boundsHaveChangedFromInitial,
  (value) => value.state.googleMapRef,
  (value) => value.state.mapLatLngIsInsideDeviceRangeCircle,
);
