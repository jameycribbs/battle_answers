var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;
        
var getRoles = function (roles) {
  return roles.join(' ')
}

var setRoles = function (roles) {
  return roles.toLowerCase().split(' ')
}

var userSchema = new Schema({
  username: String,
  password: String,
  roles: { type: [], get: getRoles, set: setRoles },
  date: { type: Date, default: Date.now }
}, { collection: 'users' });

userSchema.statics.findRoles = function (queryStr, cb) {
  this.find({ roles: { $all: queryStr.split(' ') } }, cb);
}

userSchema.statics.findAllRoles = function(cb) {
  this.find().toArray(function(err, results) {
    if (err) {
      cb(err);
    } else {
      allRoles = new Array();
      for (rec in results) {
        allRoles = allRoles.concat(rec.roles);
      }
      cb(null, allRoles);
    }
  });
}

module.exports = mongoose.model('User', userSchema);
