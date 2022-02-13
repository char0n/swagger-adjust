const path = require('path');
const rewire = require('rewire');

const build = rewire('react-scripts/scripts/build.js');
const config = build.__get__('config');

// aliases
config.resolve.alias = {
  ...config.resolve.alias,
  react: path.resolve(__dirname, '..', 'node_modules', 'swagger-adjust', 'node_modules', 'react'),
  'react-dom': path.resolve(
    __dirname,
    '..',
    'node_modules',
    'swagger-adjust',
    'node_modules',
    'react-dom'
  ),
  'react-redux': path.resolve(
    __dirname,
    '..',
    'node_modules',
    'swagger-adjust',
    'node_modules',
    'react-redux'
  ),
  ramda: path.resolve(__dirname, '..', 'node_modules', 'swagger-adjust', 'node_modules', 'ramda'),
};

// disable ModuleScopePlugin
config.resolve.plugins = [];

build.__set__('config', config);
