module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind', processNestedWorklets: true }],
      'nativewind/babel',
    ],
  };
};
