var answerProvider = require('../models/answer').answerProvider;

exports.index = function(req, res) {
  answerProvider.findAll(function(error, answers) {
    res.render('answers_index', {
      user: req.user,
      title: 'Battle Answers',
      battleAnswers: answers
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
  answerProvider.save({
    question: req.param('question'),
    answer: req.param('answer'),
    tags: req.param('tags').toLowerCase().split(' ')
  }, function(error, docs) {
    res.redirect('/answers')
  });
};

exports.edit = function(req, res) {
  answerProvider.findById(req.param('_id'), function(error, answer) {
    tag_str = '';

    if (answer.tags !== undefined) {
      for (var i = 0; i < answer.tags.length;i++) {
        tag = answer.tags[i];
        if (tag_str.length == 0) {
          tag_str = tag;
        } else {
          tag_str = tag_str + ' ' + tag;
        }
      }
    }

    res.render('answers_edit', {
      user: req.user,
      title: 'Edit Answer',
      edit_answer: answer,
      tag_str: tag_str
    });
  });
};

exports.update = function(req, res) {
  answerProvider.update(req.param('_id'), {
    question: req.param('question'),
    answer: req.param('answer'),
    tags: req.param('tags').toLowerCase().split(' ')
  }, function(error, docs) {
    res.redirect('/answers')
  });
};

exports.delete = function(req, res) {
  answerProvider.delete(req.param('_id'), function(error, docs) {
    res.redirect('/answers')
  });
};

