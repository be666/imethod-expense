// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')


let Api = {
  '/api': {
    target: 'http://0.0.0.0:3000',
    changeOrigin: true
  },
  '/fileUpload': {
    target: 'http://0.0.0.0:3000',
    changeOrigin: true
  },
  '/explorer': {
    target: 'http://0.0.0.0:3000',
    changeOrigin: true
  }
};


module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    proxyTable: Api
  }
};
