var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

UserProvider = function(host, port) {
  this.db= new Db('node-mongo-battle-answer', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


UserProvider.prototype.getCollection= function(callback) {
  this.db.collection('users', function(error, coll) {
    if (error) {
      callback(error);
    } else {
      callback(null, coll);
    }
  });
};

UserProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      coll.find().toArray(function(error, results) {
        if (error) {
          callback(error);
        } else {
          callback(null, results);
        }
      });
    }
  });
};

UserProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      coll.findOne({ _id: coll.db.bson_serializer.ObjectID.createFromHexString(id) }, 
       function(error, result) {
         if (error) {
           callback(error);
         } else {
           callback(null, result);
         };
       }
      );
    }
  });
};

UserProvider.prototype.findByUsername = function(name, callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      coll.findOne({ username: name }, 
       function(error, result) {
         if (error) {
           callback(error);
         } else {
           callback(null, result);
         };
       }
      );
    }
  });
}

UserProvider.prototype.save = function(users, callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      if (typeof(users.length) == 'undefined') {
        users = [users];
      }

      for (var i =0; i< users.length; i++) {
        user = users[i];
        user.created_at = new Date();
      }

      coll.insert(users, function() {
        callback(null, users);
      });
    }
  });
};

UserProvider.prototype.update = function(userId, users, callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      coll.update({ _id: coll.db.bson_serializer.ObjectID.createFromHexString(userId) }, users, function(error, users) {
        if (error) {
          callback(error);
        } else {
          callback(null, users);       
        };
      });
    }
  });
};

UserProvider.prototype.delete = function(userId, callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      coll.remove({ _id: coll.db.bson_serializer.ObjectID.createFromHexString(userId) }, function(error, user) {
        if (error) {
          callback(error);
        } else {
          callback(null, user);
        };
      });
    }
  });
};

exports.userProvider = new UserProvider('localhost', 27017);
