import { KeenSliderHooks, KeenSliderInstance } from "keen-slider/react";
import { MutableRefObject } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingTagName = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type KeenSliderRef = MutableRefObject<KeenSliderInstance<
  {},
  {},
  KeenSliderHooks
> | null>;
