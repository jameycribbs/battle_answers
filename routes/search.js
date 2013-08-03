var battleAnswerProvider = require('../battle_answer_provider').battleAnswerProvider;

exports.new = function(req, res) {
  battleAnswerProvider.findAll(function(error, answers) {
    var allTags = new Array();

    for (var i=0; i<answers.length; i++) { 
      tags = answers[i].tags;

      for (var t=0; t<tags.length; t++) {
        tag = tags[t];

        if (allTags.indexOf(tag) == -1) {
          allTags.push(tag);
        }
      }
    }

    res.render('search_new', {
      user: req.user,
      title: 'New Search',
      allTags: allTags.sort()
    });
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
