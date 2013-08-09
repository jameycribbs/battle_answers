var Answer = require('../models/answer.js');

exports.new = function(req, res) {
  Answer.findAllTags(function(error, allTags) { 
    res.render('search_new', {
      user: req.user,
      path: req.path,
      title: 'New Search',
      allTags: allTags
    });
  });
};

exports.create = function(req, res) {
  Answer.findTags(req.param('searchKeywords'), function(error, answers) {
    res.render('search_index', {
      user: req.user,
      path: req.path,
      title: 'Search Results',
      searchKeywords: req.param('searchKeywords'),
      searchResults: answers
    });
  });
};
