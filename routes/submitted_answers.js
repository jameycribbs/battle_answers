var Answer = require('../models/answer.js');

exports.new = function(req, res) {
  res.render('submitted_answers_new', { 
    user: req.user,
    message: req.param('msg'),
    path: req.path,
    title: 'New Battle Answer' 
  });
};

exports.create = function(req, res) {
  if (req.param('triviaQuestion').toLowerCase() == 'morale check') {
    Answer.create(
      { 
        question: req.param('question'), 
        answer: req.param('answer') 
      }, 
      function (err, small) {
        res.redirect('/submitted_answers/new?msg=Your question has been submitted for review.  Feel free to submit another.') 
      }
    );
  } else {
    res.render('submitted_answers_new', { 
      user: req.user,
      message: 'You failed to answer the trivia question correctly!',
      path: req.path,
      title: 'New Battle Answer', 
      edit_question: req.param('question'),
      edit_answer: req.param('answer')
    });
  };
};

