const path = require('path');
const rewire = require('rewire');

const start = rewire('react-scripts/scripts/start.js');
const configFactory = start.__get__('configFactory');

const configFactoryMock = (webpackEnv) => {
  const config = configFactory(webpackEnv);
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

  return config;
};

start.__set__('configFactory', configFactoryMock);
