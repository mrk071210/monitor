require('./check-versions')()


/*
var app = require('express')();
var http = require('http').Server(app);
var os = require("os");
var io = require('socket.io')(http);
var child_process=require('child_process');
var fs=require("fs");
var interval = -1;
var interval2 = -1;
var interval3 = -1;
var interval4 = -1;

io.on('connection', function (socket) {
  socket.on('ensure',function (data) {
    var infoDelay=setTimeout(function () {
      io.emit("diskarr",dealNum(getDisk()).length)
    },2000);
    //cpu数量
    if(data==1){
        io.emit('constData', {cpuarr: os.cpus().length, totalMem: os.totalmem()});
    }
  });
  //cpu信息
  if (interval < 0) {
    interval = setInterval(function () {
      let cpuInfo=os.cpus();
      io.emit("cpuUpdata",cpuInfo );
    }, 100);
  }
  //内存信息
  if (interval2 < 0) {
    interval2 = setInterval(function () {
      let freeMem = os.freemem();
      let totalMem = os.totalmem();
      io.emit("memData",{
        freeMem: freeMem,
        totalMem: totalMem,
        usedMem: totalMem - freeMem,
      } );
    }, 100);
  }
  //磁盘信息
  //获取磁盘信息
  var oldDisk=[];
  var newDisk=[];
  var diskInfo=[];
 function getDisk(){
    child_process.exec('wmic logicaldisk where "DriveType=3" get Size,FreeSpace,DeviceID', function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error:' + error);
      }
      else {
        newDisk=[];
        oldDisk=stdout.slice(stdout.lastIndexOf('Size')+4).split("  ");
        for(var i=0;i<oldDisk.length;i++){
          if(oldDisk[i]!=""&&oldDisk[i]!="undefined"){
            newDisk.push(oldDisk[i])
          }
        }
      }
    });
    return newDisk;
  }
  //处理磁盘信息
  function dealNum(arr) {
    diskInfo=[];
    for(var i=0;i<arr.length-2;i=i+3){
      var disk=[];
      disk[0]=arr[i].replace(/[\r\n:]/g, '');
      disk[1]=arr[i+2].replace(/[\r\n:]/g, '');
      disk[2]=arr[i+1].replace(/[\r\n:]/g, '');
      diskInfo.push(disk);
    }
    return diskInfo;
  }
  if (interval3 < 0) {
    interval3 = setInterval(function () {
      io.emit("diskData", dealNum(getDisk()));
    }, 100);
  }

});
http.listen(8082, function () {
  console.log('监听端口:8082');
});
*/



var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
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
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
