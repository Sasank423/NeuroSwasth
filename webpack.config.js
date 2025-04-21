import { ProvidePlugin } from 'webpack';

export const resolve = {
  fallback: {
    "path": require.resolve("path-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "buffer": require.resolve("buffer"),
    "util": require.resolve("util"),
    "fs": false,
    "url": require.resolve("url/"),
    "querystring": require.resolve("querystring-es3")
  }
};
export const plugins = [
  new ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
    process: 'process/browser',
  }),
];
