import { createTheme, ThemeProvider } from "@mui/material/styles";
// eslint-disable-next-line no-restricted-imports
import { TypographyStyleOptions } from "@mui/material/styles/createTypography";
import { FC, memo, ReactNode, useMemo } from "react";

import { useAppLocaleInfo } from "src/stores/appStore";
import colors from "src/values/colors";
import { buttonHeights } from "src/values/layoutValues";

// ==================
// === Typography ===
// ==================

type GershadTypographyVariantNames =
  | "headingH2"
  | "headingH3"
  | "headingH4"
  | "headingH5"
  | "paraExtraSmallRegular"
  | "paraExtraSmallSemiBold"
  | "paraLarge"
  | "paraMedium"
  | "paraSmall";

type GershadTypographyVariants = {
  [variantName in GershadTypographyVariantNames]: TypographyStyleOptions;
};

type GershadTypographyPropsVariantOverrides = {
  [variantName in GershadTypographyVariantNames]: true;
};

// ===============
// === z-index ===
// ===============

const gershadZIndex = {
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  onBoardingCarousel_container: 4000,
  snackbar_snackbar: 3000,
  loadingOverlay_loadingOverlay: 2500,
  menuDrawer_drawer: 2000,
  reportDescriptionOverlay_Dialog: 1600,
  userReportGroupOverlay_edgeBox: 1500,
  addPointOfInterestsButton_container: 1200,
  homePage_searchNav: 1200,
  locationMarker_addressText: 1150,
  reportOverlayContent_dialogOverlay: 1100,
  pointOfInterestListItem_bookmarkedOptionsMenu: 1101,
  alertToast_container: 1000,
  linkOverlay_link: 1000,
  reportMarker_Dialog: 1000,
  pointOfInterestListItem_pointOfInterestIcon: 10,
  overflowIndicatorWrapper_container_indicator: 10,
  currentLocationButton_locationButton: 5,
  googleMap_loadingOverlay: 4,
  googleMap_pacContainer: 3,
  googleMap_button: 2,
  rangeCircle_circleDefaultOptions: 2,
  appBarTop_appbar: 1,
  /* eslint-enable sort-keys-fix/sort-keys-fix */
} as const;

type GershadZIndex = typeof gershadZIndex;

// ===============================
// === Extend MUI global types ===
// ===============================
// Via https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants

/* eslint-disable @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface */

declare module "@mui/material/styles" {
  interface TypographyVariants extends GershadTypographyVariants {}

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions extends GershadTypographyVariants {}
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides
    extends GershadTypographyPropsVariantOverrides {}
}

// Extend (theme) the zIndex values
declare module "@mui/material/styles" {
  interface ZIndex extends GershadZIndex {}
}

/* eslint-enable @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface */

// =============================
// === Custom theme provider ===
// =============================

const MuiThemeProvider: FC<{ children: ReactNode }> = memo(({ children }) => {
  const { direction } = useAppLocaleInfo();

  const defaultTheme = createTheme();

  const theme = useMemo(() => {
    return createTheme({
      breakpoints: {
        values: {
          ...defaultTheme.breakpoints.values,
          md: 728,
          sm: 688,
        },
      },
      components: {
        MuiAccordionDetails: {
          styleOverrides: {
            root: {
              padding: "1rem",
            },
          },
        },
        MuiAccordionSummary: {
          styleOverrides: {
            content: {
              marginInlineStart: "0.5rem",
            },
            root: {
              flexDirection: "row-reverse",
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              "&.MuiAlert-standardError": {
                backgroundColor: colors.red,
              },

              "&.MuiAlert-standardSuccess": {
                backgroundColor: colors.green,
              },
              "&.MuiAlert-standardWarning": {
                backgroundColor: colors.orange,
              },

              ".MuiAlert-icon": {
                color: colors.white,
              },
              color: colors.white,
            },
          },
        },
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            contained: [
              {
                backgroundColor: colors.yellow,
                borderRadius: "9999px",
                color: colors.black,
                height: buttonHeights.medium,
                textWrap: "nowrap",
                whiteSpace: "nowrap",
              },
              {
                ":hover": {
                  background: colors.yellow,
                },
              },
            ],
            sizeLarge: {
              height: buttonHeights.large,
            },
            sizeMedium: {
              height: buttonHeights.medium,
            },
            sizeSmall: {
              height: buttonHeights.small,
            },
            text: [
              {
                color: colors.black,
              },
              {
                ":hover": {
                  background: "transparent",
                },
              },
            ],
          },
        },
        MuiButtonBase: {
          styleOverrides: {
            root: {
              "&.Mui-disabled": {
                opacity: 0.4,
              },
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            root: {
              ".MuiPaper-root": {
                // Potentially improve performance while animating in/out by hinting that
                // the browser should create a new compositing later(?) for this element.
                //
                // Grant: We apply this same fix to SelectDrawerMenu, where it significantly
                // improves performance in Android Chrome. This SwipeableDrawer doesn’t seem
                // to have suffered from the same issue but it can’t hurt to apply here just
                // in case.
                willChange: "transform",
              },
            },
          },
        },
        MuiFab: {
          styleOverrides: {
            root: [
              {
                backgroundColor: colors.yellow,
              },
              {
                ":hover": {
                  backgroundColor: colors.yellow,
                },
              },
            ],
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: [
              {
                padding: "0",
              },
              {
                ":hover": {
                  background: "transparent",
                },
              },
            ],
          },
        },
        MuiInput: {
          styleOverrides: {
            input: {
              "&.Mui-focused": {
                background: colors.yellowLight,
              },
              ":placeholder-shown": {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
              width: "100%",
            },
          },
        },
        MuiSwitch: {
          styleOverrides: {
            switchBase: {
              "&.Mui-checked": {
                color: colors.green,
              },

              "&.Mui-checked + .MuiSwitch-track": {
                backgroundColor: colors.greenLight,
              },
              color: colors.lightGrey,
            },
            track: {
              backgroundColor: colors.darkGrey,
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            arrow: {
              color: colors.darkGrey,
            },
            popper: {
              maxWidth: "10rem",
            },
            tooltip: {
              backgroundColor: colors.darkGrey,
            },
          },
        },
      },
      direction,
      palette: {
        success: {
          main: colors.green,
        },
        warning: {
          main: colors.orange,
        },
      },
      typography: {
        headingH2: {
          fontSize: "1.375rem",
          fontWeight: "700",
          lineHeight: 1.95,
        },
        headingH3: {
          fontSize: "1.0625rem",
          fontWeight: "700",
          lineHeight: 1.4,
        },
        headingH4: {
          fontSize: "1rem",
          fontWeight: "700",
          lineHeight: 1.4,
        },
        headingH5: {
          fontSize: "0.9375rem",
          fontWeight: "700",
          lineHeight: 1.4,
        },
        paraExtraSmallRegular: {
          fontSize: "0.75rem",
          fontWeight: "400",
          lineHeight: 1.16,
        },
        paraExtraSmallSemiBold: {
          fontSize: "0.75rem",
          fontWeight: "500",
          lineHeight: 1.16,
        },
        paraLarge: {
          fontSize: "1.0625rem",
          fontWeight: "400",
          lineHeight: 1.4,
        },
        paraMedium: {
          fontSize: "1rem",
          fontWeight: "400",
          lineHeight: 1.4,
        },
        paraSmall: {
          fontSize: "0.9375rem",
          fontWeight: "400",
          lineHeight: 1.4,
        },
      },
      zIndex: gershadZIndex,
    });
  }, [defaultTheme.breakpoints.values, direction]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
});

MuiThemeProvider.displayName = "MuiThemeProvider";

export default MuiThemeProvider;
