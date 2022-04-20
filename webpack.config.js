const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/kuknos-wallet-connect.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        path: require.resolve("path-browserify"),
        util: require.resolve("util/"),

    }
  },
  output: {
    filename: 'src/kuknos-wallet-connect.js',
    path: path.resolve(__dirname, 'dist'),
    library: "kuknos-wallet-connect",
    libraryTarget: "umd" 
  },
  
};