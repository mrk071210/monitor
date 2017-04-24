
const express = require('express');
const router = express.Router();
const mongodb=require("mongodb");
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/resource';


router.post('/api/searchHistory',(req,res) => {
    var findMem=function (db,data,callback) {
      var collection = db.collection('memory');
      var when={"time":data};
      collection.find(when).toArray(function (err,result) {
        if(err){
          console.log("error:"+err);
          return;
        }
        callback(result);
      });
    };
    var findCpu=function (db,data,callback) {
      var collection = db.collection('cpu');
      var when={"time":data};
      collection.find(when).toArray(function (err,result) {
        if(err){
          console.log("error:"+err);
          return;
        }
        callback(result);
      });
    };
    var findDisk=function (db,data,callback) {
      var collection = db.collection('disk');
      var when={"time":data};
      collection.find(when).toArray(function (err,result) {
        if(err){
          console.log("error:"+err);
          return;
        }
        callback(result);
      });
    };
    var findProcess=function (db,data,callback) {
      var collection = db.collection('process');
      var when={"time":data};
      collection.find(when).toArray(function (err,result) {
        if(err){
          console.log("error:"+err);
          return;
        }
        callback(result);
      });
    };
  var Data=[];
  MongoClient.connect(DB_CONN_STR, function(err, db) {
    findMem(db,req.body.time,function (result) {
      Data.push(result);
    });
    findCpu(db,req.body.time,function (result) {
      Data.push(result);
    });
    findDisk(db,req.body.time,function (result) {
      Data.push(result);
    });
    findProcess(db,req.body.time,function (result) {
      Data.push(result);
      res.json({code:200,data:Data});
    });
    db.close();
  });
});
module.exports = router;
