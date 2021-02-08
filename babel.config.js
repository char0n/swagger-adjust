'use strict';

module.exports = {
  env: {
    cjs: {
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            modules: 'commonjs',
            useBuiltIns: false,
            targets: {
              node: '10',
            },
            forceAllTransforms: false,
            ignoreBrowserslistConfig: true,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-modules-commonjs',
          {
            loose: true,
          },
        ],
        '@babel/proposal-class-properties',
        '@babel/syntax-class-properties',
        '@babel/proposal-object-rest-spread',
      ],
    },
    es: {
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            modules: false,
            useBuiltIns: false,
          },
        ],
      ],
      plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
    },
    browser: {
      sourceType: 'unambiguous', // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            useBuiltIns: false,
          },
        ],
      ],
      plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
    },
  },
};
