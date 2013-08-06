var User = require('../models/user.js');

exports.index = function(req, res) {
  User.find(function(err, recs) { 
    res.render('users_index', { 
      user: req.user,
      title: 'Users', 
      users: recs 
    });
  });
};

exports.new = function(req, res) {
  res.render('users_new', {
    user: req.user,
    title: 'New User'
  });
};

exports.create = function(req, res) {
  User.create({ username: req.param('username'), password: req.param('password'), roles: req.param('roles') }, function (err, small) {
    res.redirect('/users')
  });
};

exports.edit = function(req, res) {
  User.findOne({ _id: req.param('_id') }, function(error, rec) { 
    res.render('users_edit', {
      user: req.user,
      title: 'Edit User',
      edit_user: rec
    });
  });
};

exports.update = function(req, res) {
  User.update({ _id: req.param('_id') }, { username: req.param('username'), password: req.param('password'), roles: req.param('roles') },
   { multi: false }, function (err, numberAffected, raw) {
    res.redirect('/users');
  });
};

exports.delete = function(req, res) {
  User.remove({ _id: req.param('_id') }, function (err) {
    res.redirect('/users')
  });
};

