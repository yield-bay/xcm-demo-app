const { isEmpty } = require('lodash');
const withOptimizedImages = require('next-optimized-images');
const withPlugins = require('next-compose-plugins');

// Specifies the domain name of the deployment.
const assetPrefixConfig = {
  assetPrefix: process.env.ASSET_PREFIX,
  trailingSlash: true,
  async exportPathMap() {
    return {
      '/': { page: '/' },
    };
  },
};

let nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: { disableStaticImages: true },
  compiler: {
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: true,
  },
};

nextConfig = (process.env.NODE_ENV === 'production' && !isEmpty(assetPrefixConfig?.assetPrefix)) ? { ...nextConfig, ...assetPrefixConfig } : nextConfig;

const moduleExports = withPlugins(
  // Plugins
  [
    [withOptimizedImages, { optimizeImages: false }],
  ],
  // Next config
  nextConfig,
);

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = moduleExports;
