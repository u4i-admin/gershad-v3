import { css } from "@emotion/react";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";

// Note: adjustFontFallback visibly changes the rendering of Persian text in a
// way that presumably reduces legibility, so we keep it disabled for Persian
// fonts and list fallback fonts.
//
// See https://nextjs.org/docs/api-reference/next/font#adjustfontfallback

// We need to use local files for Iran Sans because it’s not on Google Fonts
const iranSans = localFont({
  adjustFontFallback: false,
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  src: [
    {
      path: "../static/fonts/iranSans400Normal.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../static/fonts/iranSans500Normal.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../static/fonts/iranSans700Normal.woff2",
      style: "normal",
      weight: "700",
    },
  ],
});

const roboto = Roboto({
  adjustFontFallback: true,
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const fontPrimary = css({
  ".ltr & *": roboto.style,
  ".rtl & *": iranSans.style,
});
