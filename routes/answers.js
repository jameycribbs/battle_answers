var Answer = require('../models/answer.js');

exports.index = function(req, res) {
  Answer.find(function(error, recs) { 
    res.render('answers_index', { 
      user: req.user, 
      title: 'Battle Answers', 
      answers: recs 
    });
  });
};

exports.new = function(req, res) {
  res.render('answers_new', { 
    user: req.user,
    title: 'New Answer' 
  });
};

exports.create = function(req, res) {
  Answer.create({ question: req.param('question'), answer: req.param('answer'), tags: req.param('tags') }, function (err, small) {
    res.redirect('/answers')
  });
};

exports.edit = function(req, res) {
  Answer.findOne({ _id: req.param('_id') }, function(error, rec) { 
    res.render('answers_edit', {
      user: req.user,
      title: 'Edit Answer',
      answer: rec
    });
  });
};

exports.update = function(req, res) {
  Answer.update({ _id: req.param('_id') }, 
   { 
    question: req.param('question'), 
    answer: req.param('answer'), 
    tags: req.param('tags') 
   }, 
   { multi: false }, function (err, numberAffected, raw) {
    res.redirect('/answers');
  });
};

exports.delete = function(req, res) {
  Answer.remove({ _id: req.param('_id') }, function (err) {
    res.redirect('/answers')
  });
};

