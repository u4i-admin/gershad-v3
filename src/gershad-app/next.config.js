/* eslint-disable no-param-reassign */

const validateEnvironmentVariables = require("./src/utils/environment/validateEnvironmentVariables");

/** @typedef {import('next/dist/server/config').NextConfig} NextConfig */

// ============================
// === Validate process.env ===
// ============================
//
// Will stop build if any process.env.NEXT_ values are missing or invalid.

validateEnvironmentVariables();

/* eslint-disable sort-keys-fix/sort-keys-fix */

/** @type {NextConfig["redirects"]} */
const redirects = async () => [
  {
    source: "/fa",
    destination: "/",
    statusCode: 301,
  },
];

/* eslint-enable sort-keys-fix/sort-keys-fix */

/** @type {NextConfig["webpack"]} */
const webpack = (config, options) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    // Remove unused parts of the graphql-request package from our bundle
    "./graphql-ws": false,
    "cross-fetch$": false,
    graphql$: false,
    // Replace getGraphQlSdk with mock if NEXT_PUBLIC_ENABLE_MOCK_GRAPHQL_SDK
    ...(process.env.NEXT_PUBLIC_ENABLE_MOCK_GRAPHQL_SDK
      ? {
          "src/utils/config/getGraphQlSdk":
            "src/utils/config/__mocks__/getGraphQlSdk",
        }
      : {}),
  };
  if (!options.isServer) {
    if (process.env.NEXT_INTERNAL_ENABLE_WEBPACK_BUNDLE_ANALYZER === "true") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore (webpack-bundle-analyzer is in devDependencies so won’t
      // exist on CI)
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: options.isServer
            ? "../analyze/server.html"
            : "./analyze/client.html",
        }),
      );
    }

    if (config.optimization.splitChunks) {
      config.optimization.splitChunks.cacheGroups.stringsEn = {
        chunks: "all",
        enforce: true,
        name: "stringsEn",
        test: /src\/strings\/stringsEn.*/,
      };

      config.optimization.splitChunks.cacheGroups.stringsFa = {
        chunks: "all",
        enforce: true,
        name: "stringsFa",
        test: /src\/strings\/stringsFa.*/,
      };
    }
  }

  return config;
};

const isTestBuild = (process.env.npm_lifecycle_event ?? "").startsWith("test");

/** @type {NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  distDir: isTestBuild ? ".next-test" : ".next",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  redirects,
  trailingSlash: true,
  webpack,
};

module.exports = nextConfig;
