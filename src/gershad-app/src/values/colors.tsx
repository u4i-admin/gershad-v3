/**
 * Colors based on color names and values in Figma file.
 */
const colors = {
  black: "#000000",
  darkGrey: "#3B3B3B",
  green: "#3EC48B",
  greenLight: "#2BC6844A",
  grey: "#B2B2B2",
  lightGrey: "#F0F0F0",
  orange: "#FF6006",
  red: "#FF3B30",
  white: "#FFFFFF",
  yellow: "#FFC41F",
  yellowDark: "#EFB000",
  yellowLight: " #FFC41F26",
} as const;

export default colors;

export type Color = (typeof colors)[keyof typeof colors];
