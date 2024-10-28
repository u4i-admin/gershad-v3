const {
  DATA,
  NONE,
  SELF,
  UNSAFE_EVAL,
  UNSAFE_INLINE,
  getCSP,
} = require("csp-header");

/**
 * Get Content-Security-Policy (CSP) header content.
 */
const getContentSecurityPolicyContent = () => {
  const graphQlUrlOrigin = new URL(process.env.NEXT_PUBLIC_GRAPHQL_URL).origin;
  const storageUrlOrigin = new URL(process.env.NEXT_PUBLIC_STORAGE_URL).origin;

  /**
   * This is the hash of `<script crossorigin="anonymous" nomodule>` injected by
   * Next.js near the bottom of <body>
   *
   * See https://cli.vuejs.org/guide/browser-compatibility.html#modern-mode (Vue
   * uses the same approach)
   */
  const nextJsNomoduleScriptContentSha256Hash =
    "4RS22DYeB7U14dra4KcQYxmwt5HkOInieXK1NUMBmQI=";

  return getCSP({
    directives: {
      "base-uri": [SELF],
      "connect-src": [
        DATA, // For Google Maps (shared-label-worker.js)
        SELF,
        graphQlUrlOrigin,
        storageUrlOrigin,
        process.env.NEXT_PUBLIC_API_URL,
        "https://maps.googleapis.com",
        "https://stats.g.doubleclick.net",
        "https://www.google-analytics.com",
        "https://www.gstatic.com",
        ...(process.env.NEXT_PUBLIC_COGNITO_REGION
          ? [
              `https://cognito-identity.${process.env.NEXT_PUBLIC_COGNITO_REGION}.amazonaws.com/`,
            ]
          : []),
        ...(process.env.NODE_ENV === "development"
          ? ["http://localhost:3000", "ws://*"]
          : []),
      ],
      "default-src": [SELF],
      "font-src": [SELF, "https://fonts.gstatic.com"],
      "frame-src": [
        SELF,
        "https://drive.google.com",
        "https://platform.twitter.com",
        "https://player.vimeo.com/",
        "https://www.youtube.com/",
      ],
      "img-src": [
        SELF,
        DATA,
        storageUrlOrigin,
        "https://developers.google.com",
        "https://*.googleapis.com",
        "https://www.google-analytics.com",
        "https://maps.gstatic.com",
        storageUrlOrigin,
      ],
      "manifest-src": [DATA],
      "media-src": [SELF, storageUrlOrigin],
      "object-src": [NONE],
      "script-src": [
        SELF,
        UNSAFE_EVAL, // For Google Maps (shared-label-worker.js)
        "https://maps.googleapis.com",
        "https://www.google-analytics.com",
        "https://connect.facebook.net",
        "https://platform.twitter.com",
        ...(process.env.NODE_ENV !== "development"
          ? [`'sha256-${nextJsNomoduleScriptContentSha256Hash}'`]
          : [UNSAFE_INLINE]), // required for Next.js hot code reloading
      ],
      "style-src": [
        SELF,
        UNSAFE_INLINE,
        "https://fonts.googleapis.com", // For Google Maps (util.js)
      ],
      "worker-src": ["blob:"],
    },
  });
};

module.exports = getContentSecurityPolicyContent;
