import { css, CSSObject } from "@emotion/react";

import { Styles } from "src/types/styleTypes";

/**
 * Returns CSSObject containing provided `label`, but only in development.
 *
 * @remarks
 * Emotion’s `css` prop transform doesn’t strip manually added `label`s in prod,
 * so we should use this utility to avoid long (and potentially CPU expensive?)
 * generated `className`s in production.
 */
export const devLabel = (label: string) =>
  process.env.NODE_ENV === "development"
    ? ({
        label,
      } as CSSObject)
    : null;

export const invisible = css({
  clip: "rect(1px, 1px, 1px, 1px)",
  float: "none",
  height: "auto !important",
  lineHeight: "initial !important",
  margin: "0",
  overflow: "hidden",
  padding: "0",
  position: "absolute !important" as "absolute",
  whiteSpace: "nowrap",
});

export const textOverflowEllipsis = css({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const lineClampedText = ({
  fontSize,
  lineCount,
  lineHeight,
}: {
  fontSize: string;
  lineCount: number;
  lineHeight: number;
}) =>
  css({
    display: "-webkit-box",
    fontSize,
    height: `calc(${lineCount * lineHeight} * ${fontSize})`,
    lineHeight: `calc(${fontSize} * ${lineHeight})`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lineCount,
  });

/**
 * Apply provided styles on hover.
 *
 * Uses the `any-hover` media condition (rather than `hover`) so hover styles
 * still appear on devices that support both touch and cursor input (e.g. iPads
 * and touch laptops).
 */
export const hoverStyles = (styles: Styles) =>
  css({
    "@media (any-hover: hover)": {
      "&:hover": styles,
    },
  });

export const fixedCenteredContainer = css({
  left: "50%",
  position: "fixed",
  transform: "translateX(-50%)",
});

export const hiddenWhenPointerCoarseOrNone = css({
  "@media (pointer: coarse), (pointer: none)": {
    display: "none",
  },
});

export const hiddenWhenPointerFine = css({
  "@media (pointer: fine)": {
    display: "none",
  },
});
