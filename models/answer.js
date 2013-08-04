var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

AnswerProvider = function(host, port) {
  this.db= new Db('node-mongo-battle-answer', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


AnswerProvider.prototype.getCollection= function(callback) {
  this.db.collection('battle-answers', function(error, coll) {
    if (error) {
      callback(error);
    } else {
      callback(null, coll);
    }
  });
};

AnswerProvider.prototype.findAll = function(callback) {
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

AnswerProvider.prototype.findTags = function(queryStr, callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      coll.find({ tags: { $all: queryStr.split(' ') } }).toArray(function(error, results) {
        if (error) {
          callback(error);
        } else {
          callback(null, results);
        }
      });
    }
  });
};

AnswerProvider.prototype.getAllTags = function(callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      coll.find().toArray(function(error, results) {
        if (error) {
          callback(error);
        } else {
          allTags = new Array();
          for (rec in results) {
            allTags = allTags.concat(rec.tags);
          }
          callback(null, allTags);
        }
      });
    }
  });
};

AnswerProvider.prototype.save = function(answers, callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      if (typeof(answers.length) == "undefined") {
        answers = [answers];
      }

      for (var i =0;i< answers.length;i++) {
        answer = answers[i];
        answer.created_at = new Date();
      }

      coll.insert(answers, function() {
        callback(null, answers);
      });
    }
  });
};

AnswerProvider.prototype.findById = function(id, callback) {
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

AnswerProvider.prototype.update = function(answerId, answers, callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      coll.update({ _id: coll.db.bson_serializer.ObjectID.createFromHexString(answerId) }, answers, function(error, answers) {
        if (error) {
          callback(error);
        } else {
          callback(null, answers);       
        };
      });
    }
  });
};

AnswerProvider.prototype.delete = function(answerId, callback) {
  this.getCollection(function(error, coll) {
    if (error) {
      callback(error);
    } else {
      coll.remove({ _id: coll.db.bson_serializer.ObjectID.createFromHexString(answerId) }, function(error, answer) {
        if (error) {
          callback(error);
        } else {
          callback(null, answer);
        };
      });
    }
  });
};

exports.answerProvider = new AnswerProvider('localhost', 27017);
