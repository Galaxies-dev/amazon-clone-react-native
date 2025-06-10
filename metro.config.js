const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // This makes it possible to import .glb files in your code:
    assetExts: [...(defaultConfig.resolver?.assetExts || []), 'glb'],
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
