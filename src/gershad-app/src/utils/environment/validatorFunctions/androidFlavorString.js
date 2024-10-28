const { makeValidator } = require("envalid");

/**
 * Validate that environment variable is "s3" or "".
 *
 * Envalid custom validator (https://github.com/af/envalid#custom-validators)
 */
const androidFlavorString = makeValidator((s) => {
  if (s === "googlePlay" || s === "independent") {
    return s;
  }

  throw new Error('Must be "googlePlay" or "independent');
});

module.exports = androidFlavorString;
