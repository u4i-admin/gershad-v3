import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { GoogleMap as Map } from "@react-google-maps/api";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { match, P } from "ts-pattern";

import GoogleMapsApiLoadingLogic from "src/components/GoogleMapsApiLoadingLogic";
import AddPointOfInterestsButton from "src/components/HomePage/AddPointsOfInterestButton";
import CurrentLocationButton from "src/components/HomePage/GoogleMap/CurrentLocationButton";
import HotzoneMarkerList from "src/components/HomePage/GoogleMap/HotZone/HotzoneMarkerList";
import LocationMarker from "src/components/HomePage/GoogleMap/LocationMarker";
import LocationSharingButton from "src/components/HomePage/GoogleMap/LocationSharingButton";
import PointOfInterestMarker from "src/components/HomePage/GoogleMap/PointOfInterestMarker";
import PointOfInterestMarkersList from "src/components/HomePage/GoogleMap/PointOfInterestMarkerList";
import RangeCircle, {
  rangeCircleRadius,
} from "src/components/HomePage/GoogleMap/RangeCircle";
import ReportClusterList from "src/components/HomePage/GoogleMap/ReportClusterList";
import ReportOverlay from "src/components/HomePage/ReportOverlay/ReportOverlay";
import LoadingIndicatorSvg from "src/components/icons/animation/LoadingIndicatorSvg";
import useDisplayReportGroupAtMapLatLng from "src/hooks/useDisplayReportGroupAtMapLatLng";
import useFetchAndDispatchReportsForMapBounds from "src/hooks/useFetchAndDispatchReportsForDeviceMapBounds";
import routeUrls from "src/routeUrls";
import {
  useAppBackgroundGeolocationProviderState,
  useAppDeviceLatLng,
  useAppDispatch,
  useAppHotzones,
  useAppMapHasBeenCenteredOnDeviceLatLng,
  useAppMapLatLngAndZoom,
  useAppReportGroups,
} from "src/stores/appStore";
import {
  useMapBoundsHaveChangedFromInitial,
  useMapDispatch,
  useMapGoogleMapRef,
  useMapLatLngIsInsideDeviceRangeCircle,
} from "src/stores/mapStore";
import { ReportOverlayState } from "src/types/reportTypes";
import { MuiSx } from "src/types/styleTypes";
import useRequestGeoLocationPermissionAndUpdateAppStoreIfChanged from "src/utils/geoLocation/checkAndRequestGeoLocationPermissions";
import getFormattedAddress from "src/utils/googlemaps/getFormattedAddress";
import { mapZoomLevels, platform } from "src/values/appValues";
import colors from "src/values/colors";

// =============
// === Types ===
// =============

export type GoogleMapStrings = {
  /**
   * Error message that appears if the user has rejected the app’s location
   * permission then taps the location button (or rejects it after clicking the
   * location button).
   */
  locationDeniedError: string;
  /**
   * Error message that appears if the user has disabled location services on their phone
   * permission then taps the location button.
   */
  locationDisabledError: string;
  noInternetConnection: string;
};

// ==============
// === Values ===
// ==============

const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

export const defaultLatLng: google.maps.LatLngLiteral = process.env
  .NEXT_PUBLIC_DEFAULT_LATLNG
  ? {
      lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LATLNG.split(",")[0]),
      lng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LATLNG.split(",")[1]),
    }
  : { lat: 35.681641, lng: 51.411044 };

/**
 * Delay between Map onBoundsChange and updating mapBounds state (restarted if
 * mapBounds called again).
 */
const mapBoundsUpdateIdleDelay = 125;

// ==============
// === Styles ===
// ==============

const button: MuiSx = (theme) => ({
  insetInlineStart: "1rem",
  position: "absolute",
  zIndex: theme.zIndex.googleMap_button,
});

const currentLocationButton: MuiSx = (theme) => ({
  ...button(theme),
  // Account for e.g. iOS notch in Capacitor
  top: "calc(5.5rem + env(safe-area-inset-top))",
});

const locationSharingButton: MuiSx = (theme) => ({
  ...button(theme),
  // Account for e.g. iOS notch in Capacitor
  top: "calc(9rem + env(safe-area-inset-top))",
  zIndex: theme.zIndex.googleMap_button,
});

const currentLocationButtonLoadingIndicator = css({
  height: "7.5rem",
  insetInlineStart: "-1.5rem",
  position: "absolute",
  top: "calc(3rem + env(safe-area-inset-top))",
  width: "7.5rem",
});

// =================
// === Component ===
// =================

const GoogleMap: StylableFC<{
  enableBookmarking: boolean;
}> = memo(({ className, enableBookmarking }) => {
  const router = useRouter();

  const appBackgroundGeolocationProviderState =
    useAppBackgroundGeolocationProviderState();
  const appDispatch = useAppDispatch();
  const appHotzones = useAppHotzones();
  const appDeviceLatLng = useAppDeviceLatLng();
  const appMapHasBeenCenteredOnDeviceLatLng =
    useAppMapHasBeenCenteredOnDeviceLatLng();
  const appMapLatLngAndZoom = useAppMapLatLngAndZoom();
  const appReportGroups = useAppReportGroups();

  const mapGoogleMapRef = useMapGoogleMapRef();
  const mapLatLngIsInsideDeviceRangeCircle =
    useMapLatLngIsInsideDeviceRangeCircle();
  const mapDispatch = useMapDispatch();
  const mapBoundsHaveChangedFromInitial = useMapBoundsHaveChangedFromInitial();

  const [googleMapIsLoaded, setGoogleMapIsLoaded] = useState(false);

  console.info("### googleMapIsLoaded:", googleMapIsLoaded);

  const requestGeoLocationPermissionAndUpdateAppStoreIfChanged =
    useRequestGeoLocationPermissionAndUpdateAppStoreIfChanged();

  const [formattedAddress, setFormattedAddress] = useState<string>("");

  const [activeInfoBox, setActiveInfoBox] = useState<string | null>(null);

  /**
   * There are 6 types of report state:
   * "isNotReporting": which will show the Report This Location Button
   * "isSelectingType": which will show ReportTypeSelection
   * "isSubmittingReport": which will show LoadingOverlay
   * "isDisplayingReport": which will show UserReportGroupDialog
   * "hasErrorMessages": which will show ErrorMessagesDialog
   */
  const [reportState, setReportState] = useState<ReportOverlayState>({
    type: "isNotReporting",
  });

  useDisplayReportGroupAtMapLatLng({ setReportState });

  const setMapBoundsTimeoutIdRef = useRef<number>(0);

  const updateFormattedAddress = useCallback(
    async (latLng: google.maps.LatLngLiteral | google.maps.LatLng) => {
      const formattedAddress = await getFormattedAddress(latLng);
      setFormattedAddress(formattedAddress ?? "");
    },
    [],
  );

  const onBoundsChange = useCallback(() => {
    // This prevents the app from re-rendering and re-fetching on each
    // onBoundsChange call, which could happen on every frame (60+ times per
    // second). Instead we only update the mapBounds state once the map has
    // remained stable for mapBoundsUpdateIdleDelay ms.

    // Note that if the user drags but leaves their finger stable for
    // mapBoundsUpdateIdleDelay ms mapBounds will update before they let go.
    window.clearTimeout(setMapBoundsTimeoutIdRef.current);

    setMapBoundsTimeoutIdRef.current = window.setTimeout(() => {
      const mapCenter = mapGoogleMapRef.current?.getCenter();

      if (mapCenter) {
        appDispatch({
          lat: mapCenter.lat(),
          lng: mapCenter.lng(),
          type: "mapLatLngAndZoomChanged",
          zoom: mapGoogleMapRef.current?.getZoom(),
        });

        if (!mapBoundsHaveChangedFromInitial) {
          mapDispatch({ type: "boundsChangedFromInitial" });
        }
      }
    }, mapBoundsUpdateIdleDelay);
  }, [
    appDispatch,
    mapBoundsHaveChangedFromInitial,
    mapDispatch,
    mapGoogleMapRef,
  ]);

  // Center map once appDeviceLatLngHasChanged
  const hasCenteredMapRef = useRef(false);

  const centerMap = useCallback(
    ({
      position,
      zoom,
    }: {
      position: google.maps.LatLngLiteral;
      zoom?: number;
    }) => {
      if (!mapGoogleMapRef.current) {
        return;
      }

      console.info(
        `### [GoogleMap] Centering map at ${position.lat},${position.lng}${zoom ? ` with zoom ${zoom}` : ""}`,
      );

      // Reset vector map tilt and rotation
      mapGoogleMapRef.current.setTilt(0);
      mapGoogleMapRef.current.setHeading(0);

      if (zoom) {
        mapGoogleMapRef.current.setZoom(zoom);
      }

      mapGoogleMapRef.current.panTo(position);

      hasCenteredMapRef.current = true;
    },
    [mapGoogleMapRef],
  );

  // TODO: Make reactive rather than imperative?
  const updateGoogleMapStates = useCallback(async () => {
    const position = mapGoogleMapRef?.current?.getCenter()?.toJSON();

    if (!position) {
      return;
    }

    if (!mapBoundsHaveChangedFromInitial) {
      mapDispatch({ type: "boundsChangedFromInitial" });
    }

    const distance = appDeviceLatLng
      ? window.google.maps.geometry?.spherical.computeDistanceBetween(
          appDeviceLatLng,
          position,
        )
      : null;

    // if (
    //   process.env.NEXT_PUBLIC_DEV_USE_MAP_LOCATION_FOR_PROXIMITY_NOTIFICATIONS
    // ) {
    //   //Push notification when use move the map
    //   //Move the Location Near Hotzone area to test
    //   checkAndPushHotZoneEnteredNotifications({
    //     position,
    //   });
    // }
    appDispatch({
      lat: position.lat,
      lng: position.lng,
      type: "mapLatLngAndZoomChanged",
      zoom: mapGoogleMapRef.current?.getZoom(),
    });
    mapDispatch({
      isInsideDeviceRangeCircle:
        !!appBackgroundGeolocationProviderState.precise &&
        !!distance &&
        distance < rangeCircleRadius,
      type: "mapLatLngChanged",
    });
    updateFormattedAddress(position);
  }, [
    appBackgroundGeolocationProviderState.precise,
    appDeviceLatLng,
    appDispatch,
    mapBoundsHaveChangedFromInitial,
    mapDispatch,
    mapGoogleMapRef,
    updateFormattedAddress,
  ]);

  const onCurrentLocationButtonClick = useCallback(async () => {
    // TODO: This is hacky but there doesn’t seem to be a better way unless
    // BackgroundGeolocation exposes a way to trigger a prompt that returns
    // ProviderChangeEvent

    const backgroundGeolocationProviderState =
      await requestGeoLocationPermissionAndUpdateAppStoreIfChanged();

    if (backgroundGeolocationProviderState.type === "denied") {
      appDispatch({
        messageStringKey: "GoogleMap.locationDeniedError",
        messageType: "warning",
        type: "snackbarQueued",
      });
    }

    if (backgroundGeolocationProviderState.type === "disabled") {
      appDispatch({
        messageStringKey: "GoogleMap.locationDisabledError",
        messageType: "warning",
        type: "snackbarQueued",
      });
    }

    updateGoogleMapStates();

    if (appDeviceLatLng) {
      centerMap({ position: appDeviceLatLng });
    }
  }, [
    appDeviceLatLng,
    appDispatch,
    centerMap,
    requestGeoLocationPermissionAndUpdateAppStoreIfChanged,
    updateGoogleMapStates,
  ]);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      if (!mapGoogleMapRef) return;

      mapGoogleMapRef.current = map;

      setReportState({ type: "isNotReporting" });

      setGoogleMapIsLoaded(true);
    },
    [mapGoogleMapRef],
  );

  const options: google.maps.MapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      isFractionalZoomEnabled: true,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
      maxZoom: 18,
      // Tuned to allow the user to see all of Iran on a typical phone screen
      minZoom: 4.5,
    }),
    [],
  );

  const closeReportStateAndActiveInfoBox = useCallback(() => {
    setReportState({ type: "isNotReporting" });
    setActiveInfoBox(null);
  }, []);

  // useEffect(() => {
  //   if (
  //     !mapIsInitializing &&
  //     !hasCenteredMapRef.current &&
  //     appDeviceLatLngHasChanged
  //   ) {
  //     centerMap({
  //       position: appDeviceLatLng,
  //       zoom: mapZoomLevels.locationFocussed,
  //     });
  //     hasCenteredMapRef.current = true;
  //   }
  // }, [
  //   appDeviceLatLng,
  //   appDeviceLatLngHasChanged,
  //   centerMap,
  //   mapIsInitializing,
  // ]);

  const hasCenteredMap = useRef(false);

  useEffect(() => {
    if (hasCenteredMap.current || !googleMapIsLoaded) {
      return;
    }

    // @ts-expect-error (all targeted browsers support named capture groups
    // but we can’t change Next.js compiler’s internal ES target)
    const urlHotzonePk = /\/\?hotzonePk=(?<hotzonePk>\d+)/.exec(router.asPath)
      ?.groups?.hotzonePk;

    const initialPosition = match(
      // @ts-expect-error (all targeted browsers support named capture
      // groups but we can’t change Next.js compiler’s internal ES target)
      /^\/\?initialPosition=(?<lat>[\d.]+),(?<lng>[\d.]+)$/.exec(router.asPath)
        ?.groups,
    )
      .with({ lat: P.string, lng: P.string }, ({ lat, lng }) => ({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      }))
      .otherwise(() => null);

    if (initialPosition) {
      router.push(routeUrls.home(), undefined, { shallow: true });

      centerMap({
        position: initialPosition,
        zoom: mapZoomLevels.locationFocussed,
      });

      return;
    } else if (urlHotzonePk) {
      const activeHotzone = appHotzones.filter(
        (hotzone) => hotzone.pk === parseFloat(urlHotzonePk),
      )[0];

      const hotzoneLatLng = {
        lat: activeHotzone.centroidLocation.y,
        lng: activeHotzone.centroidLocation.x,
      };

      centerMap({
        position: hotzoneLatLng,
        zoom: mapZoomLevels.default,
      });

      return;
    } else if (appDeviceLatLng && !appMapHasBeenCenteredOnDeviceLatLng) {
      centerMap({
        position: appDeviceLatLng,
        zoom: mapZoomLevels.mapCenteredOnDeviceLatLng,
      });

      appDispatch({ type: "mapCenteredOnDeviceLatLng" });
    }
  }, [
    centerMap,
    appDeviceLatLng,
    appHotzones,
    appMapLatLngAndZoom,
    appReportGroups,
    router,
    updateGoogleMapStates,
    googleMapIsLoaded,
    appDispatch,
    appMapHasBeenCenteredOnDeviceLatLng,
  ]);

  useFetchAndDispatchReportsForMapBounds({
    updateGoogleMapStates,
  });

  const mapCenter = useMemo<google.maps.LatLngLiteral>(
    () => ({
      lat: appMapLatLngAndZoom.lat,
      lng: appMapLatLngAndZoom.lng,
    }),
    [appMapLatLngAndZoom.lat, appMapLatLngAndZoom.lng],
  );

  const locationEnabledAndDeviceLatLngNotSet =
    !appDeviceLatLng &&
    appBackgroundGeolocationProviderState.type === "granted";

  return (
    <GoogleMapsApiLoadingLogic enableBookmarking={enableBookmarking}>
      <Map
        mapContainerClassName={className}
        options={options}
        center={mapCenter}
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
        // onDragEnd={updateLocation}
        onDragStart={closeReportStateAndActiveInfoBox}
        onClick={closeReportStateAndActiveInfoBox}
        onIdle={updateGoogleMapStates}
        onBoundsChanged={onBoundsChange}
        zoom={appMapLatLngAndZoom.zoom}
        clickableIcons={false}
      >
        <CurrentLocationButton
          sx={currentLocationButton}
          disabled={locationEnabledAndDeviceLatLngNotSet}
          onClick={onCurrentLocationButtonClick}
        />
        {locationEnabledAndDeviceLatLngNotSet && (
          <LoadingIndicatorSvg css={currentLocationButtonLoadingIndicator} />
        )}

        <LocationSharingButton clickable sx={locationSharingButton} />

        {appHotzones && (
          <HotzoneMarkerList
            hotzones={appHotzones}
            activeInfoBox={activeInfoBox}
            setActiveInfoBox={setActiveInfoBox}
          />
        )}

        {formattedAddress &&
          (appDeviceLatLng ||
            appBackgroundGeolocationProviderState.type !== "granted" ||
            // Workaround since on web
            // appBackgroundGeolocationProviderState.type is always "granted"
            // for testing
            platform === "web") && (
            <>
              {enableBookmarking
                ? !activeInfoBox && (
                    <PointOfInterestMarker
                      formattedAddress={formattedAddress}
                    />
                  )
                : !activeInfoBox && (
                    <LocationMarker
                      formattedAddress={formattedAddress}
                      currentLatLngIsInsideRange={
                        mapLatLngIsInsideDeviceRangeCircle
                      }
                    />
                  )}

              {appDeviceLatLng && (
                <RangeCircle currentLatLng={appDeviceLatLng} />
              )}

              {process.env
                .NEXT_PUBLIC_DEV_USE_MAP_LOCATION_FOR_PROXIMITY_NOTIFICATIONS && (
                <RangeCircle
                  currentLatLng={appMapLatLngAndZoom}
                  fillColor={colors.green}
                />
              )}

              {!enableBookmarking && !activeInfoBox && (
                <ReportOverlay
                  currentLatLngIsInsideRange={
                    mapLatLngIsInsideDeviceRangeCircle
                  }
                  reportState={reportState}
                  setReportState={setReportState}
                />
              )}
            </>
          )}

        <ReportClusterList setReportState={setReportState} />

        <PointOfInterestMarkersList />

        {enableBookmarking && <AddPointOfInterestsButton />}
      </Map>
    </GoogleMapsApiLoadingLogic>
  );
});

GoogleMap.displayName = "GoogleMap";

export default GoogleMap;
