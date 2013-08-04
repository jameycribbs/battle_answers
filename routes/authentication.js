exports.login = function(req, res){
  res.render('login', { 
    user: req.user, 
    message: req.flash('error') 
  });
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
