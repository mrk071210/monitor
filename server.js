/*

var app = require('express')();
var http = require('http').Server(app);
var os = require("os");
var io = require('socket.io')(http);
var child_process=require('child_process');
var fs=require("fs");
var moment=require('moment');
var interval = -1;
var interval2 = -1;
var interval3 = -1;
var interval4 = -1;
var flag=0;

function toDisplayMem(v) {
  if (v >= 1024 * 1024 * 1024) {
    v /= 1024 * 1024 * 1024;
    v = v.toFixed(3);
  }

  if (v >= 1024 * 1024) {
    v /= 1024 * 1024;
    v = v.toFixed(3);
  }

  if (v >= 1024) {
    v /= 1024;
    v = v.toFixed(3);
  }
  return v;
}
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
//获取并处理进程信息
var oldPro=[];
var newPro=[];
var proInfo=[];
function openProBat() {
  child_process.exec("wmic process get Name,ProcessId,ThreadCount,WorkingSetSize", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error:' + error);
    }
    else {
      oldPro=stdout.slice(stdout.lastIndexOf('WorkingSetSize')+14).split("  ");
    }
  });
  return oldPro;
}
function dealProcess(arr) {
  newPro=[];
  for(var i=0;i<arr.length;i++){
    if(arr[i]!=""&&arr[i]!="undefined"){
      newPro.push(arr[i])
    }
  }
  proInfo=[];
  for(var j=0;j<newPro.length-2;j=j+4){
    var process=[];
    process[0]=newPro[j].replace(/(^\s*)|(\s*$)/g,'');
    process[1]=newPro[j+1].replace(/(^\s*)|(\s*$)/g,'');
    process[2]=newPro[j+2].replace(/(^\s*)|(\s*$)/g,'');
    process[3]=newPro[j+3].replace(/(^\s*)|(\s*$)/g,'');
    proInfo.push(process);
  }
  return proInfo;
}
io.on('connection', function (socket) {
  socket.on('ensure',function (data) {
    //cpu数量
    if(data==1){
      io.emit('constData', {cpuarr: os.cpus().length, totalMem: os.totalmem(),diskarr:getDisk().length});
    }
  });
  //内存信息
  if (interval2 < 0) {
    interval2 = setInterval(function () {
      let freeMem = os.freemem();
      let totalMem = os.totalmem();
      io.emit("memData",{
        freeMem: toDisplayMem(freeMem),
        totalMem: toDisplayMem(totalMem),
        usedMem: totalMem - freeMem,
      } );
    }, 1000);
  }
  //cpu信息
  if (interval < 0) {
    interval = setInterval(function () {
      let cpuInfo=os.cpus();
      io.emit("cpuUpdata",cpuInfo );
    }, 1000);
  }

  //磁盘信息

  if (interval3 < 0) {
    interval3 = setInterval(function () {
      var diskData=dealNum(getDisk());
      if(diskData.length>0){
      io.emit("diskData", dealNum(getDisk()));
    }}, 1000);
  }
  //进程信息

  if (interval4 < 0) {
    interval4 = setInterval(function () {
      io.emit("proData",dealProcess(openProBat()));
    }, 1000)
  }
});
http.listen(8082, function () {
  console.log('监听端口:8082');
});



var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/resource';

var insertData = function(db) {
  //连接到表 site
  var collection = db.collection('memory');
  var collection2 = db.collection('cpu');
  var collection3 = db.collection('disk');
  var collection4 = db.collection('process');
  //插入数据
  var  saveData=setInterval(function(){
    collection.insert({"time":moment().format("YYYY-MM-DD HH:mm:ss").toLocaleString(),"totalmem":os.totalmem(),"freemem":os.freemem(),"usedmem":os.totalmem()-os.freemem()}, function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
    });
    collection2.insert({"time":moment().format("YYYY-MM-DD HH:mm:ss").toLocaleString(),"cpuInfo":os.cpus()}, function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
    });
    collection3.insert({"time":moment().format("YYYY-MM-DD HH:mm:ss").toLocaleString(),"diskInfo":dealNum(getDisk())}, function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
    });
    collection4.insert({"time":moment().format("YYYY-MM-DD HH:mm:ss").toLocaleString(),"proInfo":dealProcess(openProBat())}, function(err, result) {
      if(err)
      {
        console.log('Error:'+ err);
        return;
      }
    });
  },1000)
}

MongoClient.connect(DB_CONN_STR, function(err, db) {
  console.log("连接成功！");
  insertData(db);
});
*/
var child_process=require('child_process');
function openProBat() {
  child_process.exec("top", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error:' + error);
    }
    else {
      console.log(stdout);
    }
  });
}
openProBat();
