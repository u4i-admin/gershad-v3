/* eslint-disable no-var */

type ValidEnv = ReturnType<
  typeof import("src/utils/environment/validateEnvironmentVariables.js")
>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Window {
  dataLayer?: Array<Record<string, unknown>>;
}

declare namespace globalThis {
  var asl19StoreStates;

  var graphQlSdkOverrides:
    | undefined
    | {
        getFaqsPageResponse: import("src/generated/graphQl").GqlGetFaQsPage;
        getKnowYourRightsPageResponse: import("src/generated/graphQl").GqlGetKnowYourRightsPage;
        getPointsOfInterestResponse: import("src/generated/graphQl").GqlGetPointsOfInterest;
        getReportsResponse: import("src/generated/graphQl").GqlGetReports;
        getStaticPageResponse?: import("src/generated/graphQl").GqlGetStaticPage;
        getUserGuidePageResponse: import("src/generated/graphQl").GqlGetUserGuidePage;
      };

  var instgrm;
}

declare namespace NodeJS {
  type ProcessEnv = {
    /**
     * [DEV] Android target device ID (used in `dev-ios-run` and
     * `dev-ios-run-dev` commands).
     */
    CAPACITOR_ANDROID_TARGET_DEVICE_ID?: string;

    /**
     * [DEV] Should the app be run with the UI loaded from a local dev server (for
     * live reload)?
     *
     * When this isn’t set the app includes a production export of the Next.js
     * app resources.
     *
     * (See `capacitor.config.ts`.)
     *
     * Must be set to "true" or "" if provided.
     */
    CAPACITOR_ENABLE_DEV_SERVER?: string;

    /**
     * [DEV] iOS target device ID (used in `dev-ios-run` and `dev-ios-run-dev`
     * commands).
     */
    CAPACITOR_IOS_TARGET_DEVICE_ID?: string;

    /**
     * Set to "true" if running in a CI environment. Don’t use this in
     * application code!
     *
     * We use this to increase Jest timeouts in CI.
     */
    CI?: "true";

    /**
     * Single-line text of `google-services.json` (via FireBase console).
     *
     * Written to `android/app/google-services.json` and used by Android
     * Firebase packages.
     */
    GOOGLE_SERVICES_JSON_FILE_CONTENTS?: string;

    /**
     * Single-line text of `GoogleService-Info.plist` (via Firebase console).
     *
     * Written to `ios/App/App/GoogleService-Info.plist` and used by iOS
     * Firebase packages.
     */
    GOOGLE_SERVICE_INFO_FILE_CONTENTS?: string;

    /**
     * [OPTIONAL] Should Webpack Bundle Analyzer run during build?
     *
     * If enabled a browser window will open with a bundle visualization.
     *
     * Must be set to "true" or "" if provided.
     */
    NEXT_INTERNAL_ENABLE_WEBPACK_BUNDLE_ANALYZER?: ValidEnv["NEXT_INTERNAL_ENABLE_WEBPACK_BUNDLE_ANALYZER"];

    /**
     * Android build type
     *
     * Must be set to "googlePlay" or "independent"
     */
    NEXT_PUBLIC_ANDROID_FLAVOR?: ValidEnv["NEXT_PUBLIC_ANDROID_FLAVOR"];

    /**
     * API URL (without trailing slash).
     */
    NEXT_PUBLIC_API_URL: ValidEnv["NEXT_PUBLIC_API_URL"];

    /**
     * BackgroundGeoLocation heartbeatInterval
     */
    NEXT_PUBLIC_BACKGROUND_GEOLOCATION_HEARTBEAT: ValidEnv["NEXT_PUBLIC_BACKGROUND_GEOLOCATION_HEARTBEAT"];

    /**
     * Interval (in seconds) to refetch hot zones.
     */
    NEXT_PUBLIC_BACKGROUND_HOT_ZONES_FETCH_INTERVAL: ValidEnv["NEXT_PUBLIC_BACKGROUND_HOT_ZONES_FETCH_INTERVAL"];

    /**
     * Interval (in seconds) to fetch nearby reports.
     */
    NEXT_PUBLIC_BACKGROUND_NEARBY_REPORTS_FETCH_INTERVAL: ValidEnv["NEXT_PUBLIC_BACKGROUND_NEARBY_REPORTS_FETCH_INTERVAL"];

    /**
     * Pipeline ID of deployment (CI_PIPELINE_IID).
     *
     * e.g. "7676"
     *
     * Exists purely to expose in page <head>; should not be used in any logic!
     */
    NEXT_PUBLIC_BUILD_NUM?: ValidEnv["NEXT_PUBLIC_BUILD_NUM"];

    /**
     * AWS Cognito identity pool id.
     *
     * e.g. "us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
     */
    NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: ValidEnv["NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID"];

    /**
     * AWS Cognito Region
     *
     * e.g. "us-east-1"
     */
    NEXT_PUBLIC_COGNITO_REGION: ValidEnv["NEXT_PUBLIC_COGNITO_REGION"];

    /**
     *
     * Contact email address, used in the footer.
     *
     * e.g. "hello@gershad.com"
     */

    NEXT_PUBLIC_CONTACT_EMAIL_ADDRESS?: string;

    /**
     * Default latLng (used if app can’t access location).
     *
     * e.g. "35.743116371343035,51.37174925511403"
     */
    NEXT_PUBLIC_DEFAULT_LATLNG: ValidEnv["NEXT_PUBLIC_DEFAULT_LATLNG"];

    /**
     * Should `capacitor-background-geolocation` debug mode be enabled?
     *
     * Must be set to "true" or "" if provided.
     *
     * @see https://transistorsoft.github.io/capacitor-background-geolocation/interfaces/config.html#debug
     */
    NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DEBUG_ENABLED: ValidEnv["NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DEBUG_ENABLED"];

    /**
     * `capacitor-background-geolocation` `distanceFilter` config.
     *
     * @see https://transistorsoft.github.io/capacitor-background-geolocation/interfaces/config.html#distancefilter
     */
    NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DISTANCE_FILTER: ValidEnv["NEXT_PUBLIC_DEV_BACKGROUND_GEOLOCATION_DISTANCE_FILTER"];

    /**
     * Offset latLng (for testing).
     *
     * This is a modifier added to your actual latLng values so we can test with
     * location services enabled without revealing our actual locations to the
     * backend, and so we can move test in-country geofencing behavior while
     * moving around our local area.
     *
     * To calculate an appropriate `NEXT_PUBLIC_DEV_OFFSET_LATLNG` you should
     * subtract the your local `lat` and `lng` from the
     * `NEXT_PUBLIC_DEFAULT_LATLNG` `lat` and `lng`. e.g. if
     * `NEXT_PUBLIC_DEFAULT_LATLNG` is `35,51` and your local latLng is
     * `45,-75`, you can set `NEXT_PUBLIC_DEV_OFFSET_LATLNG` to `-10,126,`
     *
     * e.g. "8,-120"
     */
    NEXT_PUBLIC_DEV_OFFSET_LATLNG: ValidEnv["NEXT_PUBLIC_DEV_OFFSET_LATLNG"];
    /**
     * Should the proximity notifications (entering hot zones, new nearby
     * reports) logic treat the map position as the device location?
     *
     * This is useful for testing the proximity locations.
     */
    NEXT_PUBLIC_DEV_USE_MAP_LOCATION_FOR_PROXIMITY_NOTIFICATIONS: ValidEnv["NEXT_PUBLIC_DEV_USE_MAP_LOCATION_FOR_PROXIMITY_NOTIFICATIONS"];

    /**
     * Enable background geolocation settings and functionality (including
     * notifications).
     */
    NEXT_PUBLIC_ENABLE_BACKGROUND_GEOLOCATION: ValidEnv["NEXT_PUBLIC_ENABLE_BACKGROUND_GEOLOCATION"];

    /**
     * Enable Google Map native clustering (generic yellow circle with number).
     */
    NEXT_PUBLIC_ENABLE_GOOGLE_MAP_CLUSTERER: ValidEnv["NEXT_PUBLIC_ENABLE_GOOGLE_MAP_CLUSTERER"];

    /**
     * Enable Language Settings
     */
    NEXT_PUBLIC_ENABLE_LANGUAGE: ValidEnv["NEXT_PUBLIC_ENABLE_LANGUAGE"];

    /**
     * [OPTIONAL] Should app be built with the mock GraphQL SDK?
     *
     * If enabled getGraphQlSdk() will return a mock version that returns local
     * static test data.
     *
     * Must be set to "true" or "" if provided.
     */
    NEXT_PUBLIC_ENABLE_MOCK_GRAPHQL_SDK?: ValidEnv["NEXT_PUBLIC_ENABLE_MOCK_GRAPHQL_SDK"];

    /**
     * Enable P2P functionality and settings.
     */
    NEXT_PUBLIC_ENABLE_P2P: ValidEnv["NEXT_PUBLIC_ENABLE_P2P"];

    /**
     * Enabled dedicated notification settings page (if disabled notifications
     * settings appear in SettingsPage).
     *
     * Grant: I included this because I think it might make sense to have the
     * notifications and new "Background location sharing" setting in the same
     * page since they’re heavily interdependent. But this is dependent on WIP
     * design decisions so I’m leaving both options open.
     */
    NEXT_PUBLIC_ENABLE_SETTINGS_DEDICATED_NOTIFICATIONS_PAGE?: ValidEnv["NEXT_PUBLIC_ENABLE_SETTINGS_DEDICATED_NOTIFICATIONS_PAGE"];

    /**
     * Should "Powered by BeePass VPN" text on the settings page enabled?
     *
     *
     * Must be set to "true" or "" if provided.
     */
    NEXT_PUBLIC_ENABLE_SETTINGS_PAGE_POWERED_BY_BEEPASS_VPN_BADGE?: ValidEnv["NEXT_PUBLIC_ENABLE_SETTINGS_PAGE_POWERED_BY_BEEPASS_VPN_BADGE"];

    /**
     * Short SHA of Git commit that triggered deployment (CI_COMMIT_SHORT_SHA).
     *
     * e.g. "f1490a6"
     *
     * Exists purely to expose in page <head>; should not be used in any logic!
     */
    NEXT_PUBLIC_GIT_SHORT_SHA?: ValidEnv["NEXT_PUBLIC_GIT_SHORT_SHA"];

    /**
     * Google Maps API key.
     */
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: ValidEnv["NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"];

    /**
     * Google Maps map ID.
     */
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: ValidEnv["NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID"];

    /**
     * GraphQL URL.
     *
     * e.g. "http://example.com/graphql/"
     */
    NEXT_PUBLIC_GRAPHQL_URL: ValidEnv["NEXT_PUBLIC_GRAPHQL_URL"];

    /**
     * Fetch Hotzones Radius in meters
     *
     * e.g. 1000
     */
    NEXT_PUBLIC_HOTZONES_RADIUS: ValidEnv["NEXT_PUBLIC_HOTZONES_RADIUS"];

    /**
     * Fetch Reports Radius in meters
     *
     * e.g. 500
     */
    NEXT_PUBLIC_REPORTS_RADIUS: ValidEnv["NEXT_PUBLIC_REPORTS_RADIUS"];

    /**
     * Media storage URL (without trailing slash).
     *
     * e.g. "https://example.com/media"
     */
    NEXT_PUBLIC_STORAGE_URL: ValidEnv["NEXT_PUBLIC_STORAGE_URL"];

    /**
     * Gershad App Filename
     *
     * e.g: gershad.apk
     */
    NEXT_PUBLIC_UPDATE_S3_APP_FILE_NAME: ValidEnv["NEXT_PUBLIC_UPDATE_S3_APP_FILE_NAME"];

    /**
     * s3 bucket name
     *
     * e.g. gershad-xx-storage
     */
    NEXT_PUBLIC_UPDATE_S3_BUCKET_NAME: ValidEnv["NEXT_PUBLIC_UPDATE_S3_BUCKET_NAME"];

    /**
     * Android version file name
     *
     * e.g. version.txt
     */
    NEXT_PUBLIC_UPDATE_S3_VERSION_FILE_NAME: ValidEnv["NEXT_PUBLIC_UPDATE_S3_VERSION_FILE_NAME"];

    /**
     * Web URL
     *
     * Web front-end public URL (without trailing slash).
     *
     * e.g. "https://example.com"
     */
    NEXT_PUBLIC_WEB_URL: ValidEnv["NEXT_PUBLIC_WEB_URL"];

    NODE_ENV: "development" | "test" | "production";

    /**
     * Port to serve local site from (only used in `lws.config.js`).
     */
    PORT?: string;

    /**
     * Name of the current NPM script. Don’t use this in application code!
     *
     * Note that this isn’t necessarily the script you called because
     * `npm-run-all`/`run-s`/`run-p` start sub-scripts/shells.
     *
     * @see https://docs.npmjs.com/cli/v9/using-npm/scripts#current-lifecycle-event
     */
    npm_lifecycle_event?: string;

    /**
     * package.json version field.
     */
    npm_package_version?: string;
  };
}
