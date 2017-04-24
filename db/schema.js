var mongoose=require('mongoose');
var User = new mongoose.Schema({
  email : String,
  name : String,
  salt : String,
  password : String
})


//暴露出去的方法
exports.user = mongoose.model('User', User);
