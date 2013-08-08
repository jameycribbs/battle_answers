var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;
        
var setTags = function (tags) {
  return tags.toLowerCase().split(' ')
}

var answerSchema = new Schema({
  answer: String,
  question: String,
  tags: { type: [], set: setTags },
  date: { type: Date, default: Date.now },
  state: String,
  submitter_email: String
}, { collection: 'battle-answers' });

answerSchema.virtual('tags_str').get(function () {
  return this.tags.join(' ');
});

answerSchema.statics.findTags = function (queryStr, cb) {
  this.find({ tags: { $all: queryStr.toLowerCase().split(' ') } }, cb);
}

answerSchema.statics.findAllTags = function(cb) {
  this.distinct('tags', function(err, results) {
    if (err) {
      cb(err);
    } else {
      cb(null, results.sort());
    }
  });
}

module.exports = mongoose.model('Answer', answerSchema);
