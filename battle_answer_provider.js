var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

BattleAnswerProvider = function(host, port) {
  this.db= new Db('node-mongo-battle-answer', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


BattleAnswerProvider.prototype.getCollection= function(callback) {
  this.db.collection('battle-answers', function(error, answerCollection) {
    if (error) {
      callback(error);
    } else {
      callback(null, answerCollection);
    }
  });
};

BattleAnswerProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, answerCollection) {
    if (error) {
      callback(error);
    } else {
      answerCollection.find().toArray(function(error, results) {
        if (error) {
          callback(error);
        } else {
          callback(null, results);
        }
      });
    }
  });
};

BattleAnswerProvider.prototype.findTags = function(queryStr, callback) {
  this.getCollection(function(error, answerCollection) {
    if (error) {
      callback(error);
    } else {
      answerCollection.find({ tags: { $all: queryStr.split(' ') } }).toArray(function(error, results) {
        if (error) {
          callback(error);
        } else {
          callback(null, results);
        }
      });
    }
  });
};

BattleAnswerProvider.prototype.save = function(answers, callback) {
  this.getCollection(function(error, answerCollection) {
    if (error) {
      callback(error);
    } else {
      if (typeof(answers.length)=="undefined") {
        answers = [answers];
      }

      for (var i =0;i< answers.length;i++) {
        answer = answers[i];
        answer.created_at = new Date();
      }

      answerCollection.insert(answers, function() {
        callback(null, answers);
      });
    }
  });
};

BattleAnswerProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, answerCollection) {
    if (error) {
      callback(error);
    } else {
      answerCollection.findOne({ _id: answerCollection.db.bson_serializer.ObjectID.createFromHexString(id) }, 
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

BattleAnswerProvider.prototype.update = function(answerId, answers, callback) {
  this.getCollection(function(error, answerCollection) {
    if (error) {
      callback(error);
    } else {
      answerCollection.update(
       { _id: answerCollection.db.bson_serializer.ObjectID.createFromHexString(answerId) }, 
       answers,
       function(error, answers) {
         if (error) {
           callback(error);
         } else {
           callback(null, answers);       
         };
       }
      );
    }
  });
};

BattleAnswerProvider.prototype.delete = function(answerId, callback) {
  this.getCollection(function(error, answerCollection) {
    if (error) {
      callback(error);
    } else {
      answerCollection.remove(
       { _id: answerCollection.db.bson_serializer.ObjectID.createFromHexString(answerId) },
       function(error, answer) {
         if (error) {
           callback(error);
         } else {
           callback(null, answer);
         };
       }
     );
    }
  });
};

exports.battleAnswerProvider = new BattleAnswerProvider('localhost', 27017);
