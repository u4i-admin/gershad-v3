import { CSSObject, SerializedStyles } from "@emotion/react";
import { SxProps, Theme } from "@mui/material/styles";

/**
 * Emotion object or serialized style(s). Useful to allow style utility
 * functions (e.g. `breakpointStyles`) to accept a `CSSObject` directly with
 * type safety and IntelliSense.
 *
 * This should only be used for functions that accept styles and return
 * `SerializedStyles` — not for raw values passed to the `css` prop. If we pass
 * an object or array to the `css` prop directly the styles will be serialized
 * on each render (rather than serialized once when the module loads).
 *
 * @see
 * https://emotion.sh/docs/best-practices#consider-defining-styles-outside-your-components
 */
export type Styles =
  | SerializedStyles
  | CSSObject
  | Array<SerializedStyles | CSSObject>;

/**
 * [MUI `sx` prop][mui-sx-prop] value. This can be either:
 *
 * 1. An superset of Emotion’s `CSSObject` that also includes [MUI System
 *    properties][mui-system-properties] (which can have [responsive
 *    values][mui-system-responsive-values]).
 * 2. A function that accepts an MUI `Theme` object and returns the above.
 *
 * [mui-sx-prop]: https://mui.com/system/getting-started/the-sx-prop/
 * [mui-system-properties]: https://mui.com/system/properties/
 * [mui-system-responsive-values]:
 * https://mui.com/system/getting-started/usage/#responsive-values
 *
 * @see:
 *
 * - https://mui.com/system/getting-started/the-sx-prop/
 * - https://mui.com/system/getting-started/usage/
 *
 */
export type MuiSx = SxProps<Theme>;
