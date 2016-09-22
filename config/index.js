// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
let enterMap =require('./enter.json');
let proxyTarget = process.env.proxyHost || 'http://0.0.0.0:18888';
let Api = {
  '/api': {
    target: proxyTarget,
    changeOrigin: true
  },
  '/fileUpload': {
    target: proxyTarget,
    changeOrigin: true
  },
  '/upload': {
    target: proxyTarget,
    changeOrigin: true
  },
  '/avatar': {
    target: proxyTarget,
    changeOrigin: true
  },
  '/explorer': {
    target: proxyTarget,
    changeOrigin: true
  }
};
module.exports = {
  enterMap: enterMap,
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    eslint: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    proxyTable: Api
  }
}
