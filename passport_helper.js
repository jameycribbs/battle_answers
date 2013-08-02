var users = [
  { id: 1, username: 'jameycribbs', password: '11111111', email: 'jamey.cribbs@gmail.com' }
];

exports.findUserById = function(id, fn) {
  var idx = id - 1;

  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

exports.findUserByUsername = function(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.redirect('/login');
}
