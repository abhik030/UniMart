const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');

// Get the path to the .env file
const envPath = path.resolve(__dirname, '../config/.env');

// Load environment variables from .env file
const env = dotenv.config({ path: envPath }).parsed || {};

// Create a new webpack.DefinePlugin instance with the environment variables
const definePlugin = new webpack.DefinePlugin({
  'process.env': JSON.stringify(env),
});

module.exports = {
  // Your existing webpack configuration
  plugins: [
    definePlugin,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "util": require.resolve("util/"),
      "fs": false,
      "net": false,
      "tls": false,
      "dns": false,
      "child_process": false,
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "url": require.resolve("url/"),
    },
  },
}; 