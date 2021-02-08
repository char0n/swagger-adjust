'use strict';

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const nonMinimizeTrait = {
  optimization: {
    minimize: false,
    usedExports: false,
    concatenateModules: false,
  },
};

const minimizeTrait = {
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};

const swaggerAdjust = {
  mode: 'production',
  entry: './src/index.js',
  target: 'web',
  externals: {
    react: 'React',
  },
  output: {
    path: path.resolve('./dist'),
    filename: 'swagger-adjust.js',
    libraryTarget: 'umd',
    library: 'SwaggerAdjust',
  },
  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 400000,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  ...nonMinimizeTrait,
};

const swaggerAdjustMin = {
  mode: 'production',
  entry: './src/index.js',
  target: 'web',
  externals: {
    react: 'React',
  },
  output: {
    path: path.resolve('./dist'),
    filename: 'swagger-adjust.min.js',
    libraryTarget: 'umd',
    library: 'SwaggerAdjust',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  ...minimizeTrait,
};

module.exports = [swaggerAdjust, swaggerAdjustMin];
