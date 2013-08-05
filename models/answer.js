var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;
        
var getTags = function (tags) {
  return tags.join(' ')
}

var setTags = function (tags) {
  return tags.toLowerCase().split(' ')
}

var answerSchema = new Schema({
  answer: String,
  question: String,
  tags: { type: [], get: getTags, set: setTags },
  date: { type: Date, default: Date.now }
}, { collection: 'battle-answers' });

answerSchema.statics.findTags = function (queryStr, cb) {
  this.find({ tags: { $all: queryStr.split(' ') } }, cb);
}

answerSchema.statics.findAllTags = function(cb) {
  this.find().toArray(function(error, results) {
    if (error) {
      cb(error);
    } else {
      allTags = new Array();
      for (rec in results) {
        allTags = allTags.concat(rec.tags);
      }
      cb(null, allTags);
    }
  });
}

module.exports = mongoose.model('Answer', answerSchema);
