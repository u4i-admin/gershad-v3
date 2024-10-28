const { cleanEnv, str, url } = require("envalid");

const booleanString = require("./validatorFunctions/booleanString.js");
const protocolAndHost = require("./validatorFunctions/protocolAndHost.js");
const latLng = require("./validatorFunctions/latLng.js");
const integerString = require("./validatorFunctions/integerString.js");
const androidFlavorString = require("./validatorFunctions/androidFlavorString.js");

const validateEnvironmentVariables = () => {
  // ----------------------------------
  // --- Validate env using Envalid ---
  // ----------------------------------

  const env = cleanEnv(process.env, {
    NEXT_INTERNAL_ENABLE_WEBPACK_BUNDLE_ANALYZER: booleanString({
      default: "",
    }),
    NEXT_PUBLIC_ANDROID_FLAVOR: androidFlavorString({ default: "" }),
    NEXT_PUBLIC_API_URL: protocolAndHost(),
    NEXT_PUBLIC_BACKGROUND_GEOLOCATION_HEARTBEAT: integerString(),
    NEXT_PUBLIC_BACKGROUND_HOT_ZONES_FETCH_INTERVAL: integerString(),
    NEXT_PUBLIC_BACKGROUND_NEARBY_REPORTS_FETCH_INTERVAL: integerString(),
    NEXT_PUBLIC_BUILD_NUM: str({ default: "" }),
    NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: str({ default: "" }),
    NEXT_PUBLIC_COGNITO_REGION: str({ default: "" }),
    NEXT_PUBLIC_CONTACT_EMAIL_ADDRESS: str(),
    NEXT_PUBLIC_DEFAULT_LATLNG: latLng({ default: "" }),
    NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DEBUG_ENABLED: booleanString({
      default: "",
    }),
    NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DISTANCE_FILTER: integerString({
      default: "",
    }),
    NEXT_PUBLIC_DEV_OFFSET_LATLNG: latLng({ default: "" }),
    NEXT_PUBLIC_DEV_USE_MAP_LOCATION_FOR_PROXIMITY_NOTIFICATIONS: booleanString(
      {
        default: "",
      },
    ),
    NEXT_PUBLIC_ENABLE_BACKGROUND_GEOLOCATION: booleanString({
      default: "",
    }),
    NEXT_PUBLIC_ENABLE_GOOGLE_MAP_CLUSTERER: booleanString({ default: "" }),
    NEXT_PUBLIC_ENABLE_LANGUAGE: booleanString({ default: "" }),
    NEXT_PUBLIC_ENABLE_MOCK_GRAPHQL_SDK: booleanString({ default: "" }),
    NEXT_PUBLIC_ENABLE_P2P: booleanString({ default: "" }),
    NEXT_PUBLIC_ENABLE_SETTINGS_DEDICATED_NOTIFICATIONS_PAGE: booleanString({
      default: "",
    }),
    NEXT_PUBLIC_ENABLE_SETTINGS_PAGE_POWERED_BY_BEEPASS_VPN_BADGE:
      booleanString({ default: "" }),
    NEXT_PUBLIC_GIT_SHORT_SHA: str({ default: "" }),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: str(),
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: str(),
    NEXT_PUBLIC_GRAPHQL_URL: url(),
    NEXT_PUBLIC_HOTZONES_RADIUS: integerString(),
    NEXT_PUBLIC_REPORTS_RADIUS: integerString(),
    NEXT_PUBLIC_STORAGE_URL: protocolAndHost(),
    NEXT_PUBLIC_UPDATE_S3_APP_FILE_NAME: str(),
    NEXT_PUBLIC_UPDATE_S3_BUCKET_NAME: str(),
    NEXT_PUBLIC_UPDATE_S3_VERSION_FILE_NAME: str(),
    NEXT_PUBLIC_WEB_URL: protocolAndHost(),
  });

  if (
    process.env.NODE_ENV === "development" &&
    !process.env.NEXT_PUBLIC_DEV_OFFSET_LATLNG
  ) {
    console.error(
      "You must set NEXT_PUBLIC_DEV_OFFSET_LATLNG in development builds! For security we require that you set this to avoid revealing your home/work location to the backend. See gershad-env.d.ts for details on how to calculate this value.",
    );
    process.exit(1);
  }

  if (
    process.env.NODE_ENV === "production" &&
    (process.env.NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DEBUG_ENABLED ||
      process.env.NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DISTANCE_FILTER ||
      process.env.NEXT_PUBLIC_DEV_OFFSET_LATLNG ||
      process.env
        .NEXT_PUBLIC_DEV_USE_MAP_LOCATION_FOR_PROXIMITY_NOTIFICATIONS ||
      process.env.NEXT_PUBLIC_ENABLE_LANGUAGE)
  ) {
    console.error(
      "You cannot enable NEXT_PUBLIC_DEV_* or NEXT_PUBLIC_ENABLE_LANGUAGE flags in production builds!",
    );
    // process.exit(1);
  }

  // ---------------------------------------------------------------------------
  // --- Ensure env conforms to NodeJS.ProcessEnv (declared in lsw-env.d.ts) ---
  // ---------------------------------------------------------------------------
  /**
   * @type {Omit<NodeJS.ProcessEnv, "NODE_ENV">}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const typedEnv = env;

  // ------------------------------------------------------
  // --- Return env (used by mw-env.d.ts ValidEnv type) ---
  // ------------------------------------------------------

  return env;
};

module.exports = validateEnvironmentVariables;
