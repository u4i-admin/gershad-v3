import { css, Global } from "@emotion/react";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { Theme, useTheme } from "@mui/material/styles";
import { StandaloneSearchBox } from "@react-google-maps/api";
import Link from "next/link";
import { FC, memo, useCallback, useMemo, useRef } from "react";

import ChevronSvg from "src/components/icons/ChevronSvg";
import MenuSvg from "src/components/icons/MenuSvg";
import routeUrls from "src/routeUrls";
import {
  useAppDispatch,
  useAppGoogleMapsApiState,
  useAppStrings,
} from "src/stores/appStore";
import { useMapGoogleMapRef } from "src/stores/mapStore";
import { MuiSx } from "src/types/styleTypes";
import { mapZoomLevels } from "src/values/appValues";
import colors from "src/values/colors";

const navContainerBorderRadius = "0.625rem";
const navContainerHeight = "3.5rem";
const navContainerInsetInline = "1rem";
const navContainerPadding = "0.875rem";
// Account for e.g. iOS notch in Capacitor
const navContainerTop = "calc(1rem + env(safe-area-inset-top))";
const navContainerWidth = "calc(100vw - 2rem)";

export type HomePageSearchNavStrings = {
  /**
   * Placeholder text for a search field.
   * This prompts users input location.
   */
  searchPlaceholder: string;
};

/**
 * Elevation level of wrapping `Paper` + `.pac-container` rendered by
 * `StandaloneSearchBox`.
 */
const elevation = 4;

const navContainer: MuiSx = [
  ({ zIndex }) => ({
    zIndex: zIndex.homePage_searchNav,
  }),
  // Note: These positioning and alignment properties would usually be set from
  // the outside but in this case we set them inside so we can synchronize these
  // styles with pacGlobal
  {
    height: navContainerHeight,
    insetInline: navContainerInsetInline,
    position: "absolute",
    top: navContainerTop,
    width: navContainerWidth,
  },
  {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: navContainerBorderRadius,
    columnGap: "1rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: navContainerPadding,
  },
];

/**
 * @react-google-maps/api StandaloneSearchBox styles.
 *
 * We may want to further customize this to better match the app styling based
 * on design feedback.
 */
const pacGlobal = ({
  containerBoxShadow,
  theme,
}: {
  containerBoxShadow: string;
  theme: Theme;
}) =>
  css({
    ".pac-container": [
      {
        borderRadius: navContainerBorderRadius,
        boxShadow: containerBoxShadow,
        insetInline: `${navContainerInsetInline} !important`,
        overflow: "auto",
        padding: navContainerPadding,
        top: `calc(${navContainerTop} + ${navContainerHeight} + 0.5rem) !important`,
        width: `${navContainerWidth} !important`,
        zIndex: theme.zIndex.googleMap_pacContainer,
      },
      {
        // "powered by Google" image
        //
        // Note: It’s against Google’s rules to hide this:
        // https://developers.google.com/maps/documentation/javascript/place-autocomplete
        "::after": {
          marginTop: navContainerPadding,
        },
      },
    ],
    ".pac-item:first-of-type": {
      borderTop: "none",
    },
  });

const menuButtonVisualLengthRem = 1.5;

// Button takes up 2x the visual size of menuSvg to make the tappable area
// larger (negative margins used so it only takes up the space of 1x size)
const menuButton = css({
  alignItems: "center",
  display: "flex",
  height: `${menuButtonVisualLengthRem * 2}rem`,
  justifyContent: "center",
  margin: `-${menuButtonVisualLengthRem / 2}rem`,
  width: `${menuButtonVisualLengthRem * 2}rem`,
});

const menuSvg = css({
  color: colors.darkGrey,
  flex: "0 0 auto",
  height: `${menuButtonVisualLengthRem}rem`,
  width: `${menuButtonVisualLengthRem}rem`,
});

const searchInput = css(
  {
    width: "100%",
  },
  {
    "::placeholder": {
      color: colors.grey,
    },
  },
);

const searchBox = css({
  flex: "1 1 auto",
});

const chevronSvg = css(
  {
    height: "1.5rem",
    width: "1.5rem",
  },
  {
    "html.ltr &": {
      transform: "rotate(180deg)",
    },
  },
);

const HomePageSearchNav: FC<{ enableBookmarking: boolean }> = memo(
  ({ enableBookmarking, ...remainingProps }) => {
    const appDispatch = useAppDispatch();
    const strings = useAppStrings();
    const googleMapsApiState = useAppGoogleMapsApiState();

    const mapRef = useMapGoogleMapRef();

    const theme = useTheme();

    const openMenuDrawer = useCallback(
      () => appDispatch({ type: "openMenuDrawer" }),
      [appDispatch],
    );

    const autocompleteRef = useRef<google.maps.places.SearchBox | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const onLoad = useCallback((autocomplete: google.maps.places.SearchBox) => {
      autocompleteRef.current = autocomplete;
    }, []);

    const onPlacesChanged = useCallback(() => {
      if (autocompleteRef.current !== null) {
        const places = autocompleteRef.current?.getPlaces();

        if (!places) return;

        const placeBounds = places[0].geometry?.viewport;

        if (placeBounds) {
          mapRef.current?.fitBounds(placeBounds);
        } else {
          const location = places[0].geometry?.location;

          if (!location) return;

          mapRef.current?.panTo(location);

          // TODO: could build a function to parse
          // PlaceResult.address_components to figure out the `address level`
          // Based on the address level(street | city | state | country), we can set different zoom level
          mapRef.current?.setZoom(mapZoomLevels.locationFocussed);
        }

        if (inputRef.current) {
          inputRef.current.value = "";
          inputRef.current.blur();
        }
      } else {
        console.warn("Autocomplete is not loaded yet!");
      }
    }, [mapRef]);

    return (
      <>
        <Global
          styles={useMemo(
            () =>
              pacGlobal({
                containerBoxShadow: theme.shadows[elevation],
                theme,
              }),
            [theme],
          )}
        />

        <Paper sx={navContainer} elevation={elevation} {...remainingProps}>
          {enableBookmarking ? (
            <Link href={routeUrls.pointsOfInterest()} css={menuButton}>
              <ChevronSvg direction="start" css={chevronSvg} />
            </Link>
          ) : (
            <IconButton css={menuButton} disableRipple onClick={openMenuDrawer}>
              <MenuSvg css={menuSvg} />
            </IconButton>
          )}
          <div css={searchBox}>
            {googleMapsApiState === "loaded" && (
              <StandaloneSearchBox
                onLoad={onLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  css={searchInput}
                  placeholder={strings.HomePageSearchNav.searchPlaceholder}
                  ref={inputRef}
                  type="text"
                />
              </StandaloneSearchBox>
            )}
          </div>
        </Paper>
      </>
    );
  },
);

HomePageSearchNav.displayName = "HomePageSearchNav";

export default HomePageSearchNav;
