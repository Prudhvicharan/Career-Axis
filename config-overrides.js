const webpack = require("webpack");

module.exports = function override(config) {
  // Add polyfills for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer/"),
    path: require.resolve("path-browserify"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util/"),
    url: require.resolve("url/"),
    os: require.resolve("os-browserify/browser"),
    vm: require.resolve("vm-browserify"),
    fs: false,
    net: false,
    tls: false,
    dns: false,
    process: require.resolve("process/browser"),
  };

  // Add process polyfill
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    })
  );

  // For webpack 5 - necessary for axios
  config.resolve.alias = {
    ...config.resolve.alias,
    "process/browser": require.resolve("process/browser"),
  };

  return config;
};
