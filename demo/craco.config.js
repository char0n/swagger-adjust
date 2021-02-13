'use strict';

const path = require('path');

module.exports = {
  webpack: {
    alias: {
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
      'react-redux': path.resolve(__dirname, '..', 'node_modules', 'react-redux'),
      ramda: path.resolve(__dirname, '..', 'node_modules', 'ramda'),
    },
  },
};
