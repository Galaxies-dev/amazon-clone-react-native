const { withNativeWind } = require('nativewind/metro');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const defaultConfig = getSentryExpoConfig(__dirname, {
  annotateReactComponents: true,
  enableSourceContextInDevelopment: true,
});

defaultConfig.resolver.assetExts.push('glb');

module.exports = withNativeWind(defaultConfig, { input: './global.css' });
