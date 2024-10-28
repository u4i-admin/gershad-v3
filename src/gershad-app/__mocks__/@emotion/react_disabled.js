// (Disabled for this project since this isn’t compatible with @mui/material’s
// use of Emotion)

module.exports = {
  // Return undefined from all @emotion/react calls to remove messy "You have
  // tried to stringify object returned from `css` function." css attributes
  // from Jest snapshots.
  css: () => undefined,
  keyframes: () => undefined,
};
