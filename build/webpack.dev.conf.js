var config = require('../config')
var webpack = require('webpack')
var path = require('path')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var _ = require('lodash');
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});
let entryList = function () {
  let entryList = [];
  let enterMap = config.enterMap;
  for (let moduleName in enterMap) {
    let moduleEnterList = enterMap[moduleName];
    moduleEnterList.forEach(function (x) {
      let enter = Object.keys(x)[0];
      entryList.push(new HtmlWebpackPlugin(_.extend({
        filename: `${enter}.html`,
        template: `templates/default.ejs`,
        inject: true,
        chunks: [`${enter}`],
        moduleClass: moduleName,
        enterClass: enter.replace(new RegExp('/', 'g'), '-')
      }, x[enter])))
    });
  }
  return entryList
};
module.exports = merge(baseWebpackConfig, {
  resolve: {
    alias: {
      // 'IConf': path.resolve(__dirname, '../src/config.dev.js')
    }
  },
  module: {
    loaders: utils.styleLoaders()
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
    // https://github.com/ampedandwired/html-webpack-plugin
  ].concat(entryList())
})
