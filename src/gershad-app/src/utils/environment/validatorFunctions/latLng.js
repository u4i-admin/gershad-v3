const { makeValidator } = require("envalid");

/**
 * Validate that environment variable is a lat,lng value.
 *
 * Valid examples:
 *
 * - "35.681641,51.411044"
 * - "-33.858431,-151.214951"
 *
 * Envalid custom validator (https://github.com/af/envalid#custom-validators)
 */
const latLng = makeValidator((s) => {
  if (/^[-\d.]+,[-\d.]+$/.test(s)) {
    return s;
  }

  throw new Error(
    'Must be latitude and longitude floats separated by a comma and no spaces (e.g. "35.681641,51.411044")',
  );
});

module.exports = latLng;
