var Answer = require('../models/answer.js');

exports.new = function(req, res) {
  res.render('submitted_answers_new', { 
    title: 'New Battle Answer' 
  });
};

exports.create = function(req, res) {
  if (req.param('trivia_question').toLowerCase() == 'morale check') {
    Answer.create(
      { 
        question: req.param('question'), 
        answer: req.param('answer') 
      }, 
      function (err, small) {
        res.redirect('/submitted_answers_new') 
      }
    );
  } else {
    res.render('submitted_answers_new', { 
      message: 'You failed to answer the trivia question correctly!',
      title: 'New Battle Answer' 
    });
  };
};

