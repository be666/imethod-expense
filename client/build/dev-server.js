var path = require('path')
var express = require('express')
var webpack = require('webpack')
var fs = require('fs')
var config = require('../config')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)


app.use('/', function (req, res, next) {
  var _originalUrl = req.originalUrl
  let _originalArr = _originalUrl.split('?')
  let originalUrl = _originalArr[0]
  if (originalUrl === '/') {
    _originalArr[0] = originalUrl + 'hook.html';
    return res.redirect(_originalArr.join('?'))
  } else if (originalUrl.indexOf('.') === -1) {
    var fPath = path.resolve(__dirname, '../static' + originalUrl + '.html')
    if (fs.existsSync(fPath)) {
      return res.sendFile(fPath)
    } else {
      console.log(originalUrl)
      _originalArr[0] = originalUrl + '.html'
      console.log(_originalArr.join('?'))
      return res.redirect(_originalArr.join('?'))
    }
  }
  next()
})

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
