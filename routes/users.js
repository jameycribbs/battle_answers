var userProvider = require('../models/user').userProvider;

exports.index = function(req, res) {
  userProvider.findAll(function(error, recs) {
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
  userProvider.save({
    username: req.param('username'),
    password: req.param('password'),
    roles: req.param('roles').toLowerCase().split(' ')
  }, function(error, docs) {
    res.redirect('/users')
  });
};

exports.edit = function(req, res) {
  userProvider.findById(req.param('_id'), function(error, rec) {
    role_str = '';

    if (rec.roles !== undefined) {
      for (var i = 0; i < rec.roles.length;i++) {
        role = rec.roles[i];
        if (role_str.length == 0) {
          role_str = role;
        } else {
          role_str = role_str + ' ' + role;
        }
      }
    }

    res.render('users_edit', {
      user: req.user,
      title: 'Edit User',
      edit_user: rec,
      role_str: role_str
    });
  });
};

exports.update = function(req, res) {
  userProvider.update(req.param('_id'), {
    username: req.param('username'),
    password: req.param('password'),
    roles: req.param('roles').toLowerCase().split(' ')
  }, function(error, docs) {
    res.redirect('/users')
  });
};

exports.delete = function(req, res) {
  userProvider.delete(req.param('_id'), function(error, docs) {
    res.redirect('/users')
  });
};

