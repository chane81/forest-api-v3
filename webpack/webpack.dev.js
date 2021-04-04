/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const config = require('./webpack.config');
const nodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
const rootPath = path.resolve(__dirname, '../');

// dot env 설정
const Dotenv = require('dotenv-webpack');
const dotEnvPath = path.resolve(rootPath, 'config/.env.dev');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    ...config.plugins,
    new Dotenv({
      path: dotEnvPath
    }),
    new nodemonPlugin({
      watch: path.resolve(rootPath, 'dist'),
      script: path.resolve(rootPath, 'dist/server.js')
    })
  ]
});
