import Document, { Head, Html, Main, NextScript } from "next/document";

import getContentSecurityPolicyContent from "src/utils/document/getContentSecurityPolicyContent";
import getLocaleMetadata from "src/utils/getLocaleMetadata";
import getManifestDataUrl from "src/utils/getManifestDataUrl";

/// =================================
// === Get inline script content ===
// =================================

const cspContent = getContentSecurityPolicyContent();

// =======================
// === Custom document ===
// =======================

class GershadDocument extends Document {
  render() {
    const { localeCode } = getLocaleMetadata(
      this.props.dangerousAsPath.slice(1, 3),
    );

    const manifestDataUrl = getManifestDataUrl({
      localeCode,
      webUrl: process.env.NEXT_PUBLIC_WEB_URL,
    });

    return (
      <Html>
        <Head>
          {/* ---------------------------
          --- Content Security Policy ---
          --------------------------- */}

          <meta httpEquiv="Content-Security-Policy" content={cspContent} />

          {/* -------------------------------------------
          --- Environment variable values (for debug) ---
          ------------------------------------------- */}
          <meta
            name="NEXT_PUBLIC_ANDROID_FLAVOR"
            content={process.env.NEXT_PUBLIC_ANDROID_FLAVOR}
          />
          <meta
            name="NEXT_PUBLIC_API_URL"
            content={process.env.NEXT_PUBLIC_API_URL}
          />
          <meta
            name="NEXT_PUBLIC_BACKGROUND_GEOLOCATION_HEARTBEAT"
            content={process.env.NEXT_PUBLIC_BACKGROUND_GEOLOCATION_HEARTBEAT}
          />
          <meta
            name="NEXT_PUBLIC_BUILD_NUM"
            content={process.env.NEXT_PUBLIC_BUILD_NUM}
          />
          <meta
            name="NEXT_PUBLIC_CONTACT_EMAIL_ADDRESS"
            content={process.env.NEXT_PUBLIC_CONTACT_EMAIL_ADDRESS}
          />
          <meta
            name="NEXT_PUBLIC_DEFAULT_LATLNG"
            content={process.env.NEXT_PUBLIC_DEFAULT_LATLNG}
          />
          <meta
            name="NEXT_PUBLIC_ENABLE_LANGUAGE"
            content={process.env.NEXT_PUBLIC_ENABLE_LANGUAGE}
          />
          <meta
            name="NEXT_PUBLIC_ENABLE_P2P"
            content={process.env.NEXT_PUBLIC_ENABLE_P2P}
          />
          <meta
            name="NEXT_PUBLIC_ENABLE_BACKGROUND_GEOLOCATION"
            content={process.env.NEXT_PUBLIC_ENABLE_BACKGROUND_GEOLOCATION}
          />
          <meta
            name="NEXT_PUBLIC_ENABLE_GOOGLE_MAP_CLUSTERER"
            content={process.env.NEXT_PUBLIC_ENABLE_GOOGLE_MAP_CLUSTERER}
          />
          <meta
            name="NEXT_PUBLIC_ENABLE_SETTINGS_DEDICATED_NOTIFICATIONS_PAGE"
            content={
              process.env
                .NEXT_PUBLIC_ENABLE_SETTINGS_DEDICATED_NOTIFICATIONS_PAGE
            }
          />
          <meta
            name="NEXT_PUBLIC_ENABLE_SETTINGS_PAGE_POWERED_BY_BEEPASS_VPN_BADGE"
            content={
              process.env
                .NEXT_PUBLIC_ENABLE_SETTINGS_PAGE_POWERED_BY_BEEPASS_VPN_BADGE
            }
          />
          <meta
            name="NEXT_PUBLIC_GIT_SHORT_SHA"
            content={process.env.NEXT_PUBLIC_GIT_SHORT_SHA}
          />
          <meta
            name="NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
            content={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          />
          <meta
            name="NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID"
            content={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
          />
          <meta
            name="NEXT_PUBLIC_STORAGE_URL"
            content={process.env.NEXT_PUBLIC_STORAGE_URL}
          />
          <meta
            name="NEXT_PUBLIC_UPDATE_S3_APP_FILE_NAME"
            content={process.env.NEXT_PUBLIC_UPDATE_S3_APP_FILE_NAME}
          />
          <meta
            name="NEXT_PUBLIC_UPDATE_S3_BUCKET_NAME"
            content={process.env.NEXT_PUBLIC_UPDATE_S3_BUCKET_NAME}
          />
          <meta
            name="NEXT_PUBLIC_UPDATE_S3_VERSION_FILE_NAME"
            content={process.env.NEXT_PUBLIC_UPDATE_S3_VERSION_FILE_NAME}
          />
          <meta
            name="NEXT_PUBLIC_WEB_URL"
            content={process.env.NEXT_PUBLIC_WEB_URL}
          />

          <link rel="manifest" href={manifestDataUrl} />
        </Head>
        <body>
          <Main />

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default GershadDocument;
