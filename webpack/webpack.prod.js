/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const config = require('./webpack.config');
const path = require('path');
const rootPath = path.resolve(__dirname, '../');

// dot env 설정
const Dotenv = require('dotenv-webpack');
const dotEnvPath = path.resolve(rootPath, 'config/.env.prod');

module.exports = merge(config, {
  mode: 'production',
  plugins: [
    ...config.plugins,
    new Dotenv({
      path: dotEnvPath
    })
  ]
});
