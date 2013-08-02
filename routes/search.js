var battleAnswerProvider = require('../battle_answer_provider').battleAnswerProvider;

exports.new = function(req, res) {
  res.render('search_new', {
    user: req.user,
    title: 'New Search'
  });
};

exports.create = function(req, res) {
  battleAnswerProvider.findTags(req.param('searchKeywords').toLowerCase(), function(error, answers) {
    res.render('search_index', {
      user: req.user,
      title: 'Search Results',
      searchKeywords: req.param('searchKeywords'),
      searchResults: answers
    });
  });
};

