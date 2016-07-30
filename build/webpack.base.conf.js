var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

let entryList = function () {
  let entryList = {};
  let enterMap = config.enterMap;
  for (let moduleName in enterMap) {
    let moduleEnterList = enterMap[moduleName];
    moduleEnterList.forEach(function (x) {
      let enter = Object.keys(x)[0];
      if (x[enter]['js']) {
        entryList[enter] = path.resolve(__dirname, `../${x[enter]['js']}`)
      } else {
        entryList[enter] = path.resolve(__dirname, `../src/${moduleName}/${enter}.js`)
      }
    });
  }
  return entryList;
};
let eslintConf = config.build.config ? [
  {
    test: /\.vue$/,
    loader: 'eslint',
    include: projectRoot,
    exclude: /node_modules/
  },
  {
    test: /\.js$/,
    loader: 'eslint',
    include: projectRoot,
    exclude: /node_modules/
  }
] : [];

module.exports = {
  entry: entryList(),
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'IConf': path.resolve(__dirname, '../src/config/config.js')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    preLoaders: eslintConf,
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: utils.cssLoaders()
  }
}
