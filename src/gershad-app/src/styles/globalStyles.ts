import { css } from "@emotion/react";

import resetStyles from "src/styles/resetStyles";
import { fontPrimary } from "src/styles/typeStyles";

const globalStyles = css(
  resetStyles,
  {
    html: {
      // Set document font iOS system font. This sets the document font size
      // (rem) to the system/app font size (modifiable in iOS Settings app
      // "Display" section, and in Control Center "Text Size" widget)
      //
      // Android applies the system font size to web views  automatically so we
      // don’t need to intervene for it.
      //
      // See:
      // - https://webkit.org/blog/3709/using-the-system-font-in-web-content/
      // - https://dev.to/colingourlay/how-to-support-apple-s-dynamic-text-in-your-web-content-with-css-40c0
      font: "-apple-system-body",
      fontSize: "100%",
      overscrollBehavior: "none",
    },
  },
  {
    body: [
      fontPrimary,
      {
        fontStyle: "normal",
        fontWeight: "normal",
        lineHeight: "1.7",
        overflow: "hidden",
        userSelect: "none",
      },
    ],
    "button, input[type='button'], input[type='submit']": {
      cursor: "pointer",
    },
  },
  {
    ":focus": {
      outline: "revert",
    },
    "html.focusOutlinesHidden *": {
      outline: "none !important",
    },
  },
);

export default globalStyles;
