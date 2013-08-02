var express = require('express')
  , routes = require('./routes')
  , authenticationRoutes = require('./routes/authentication')
  , answerRoutes = require('./routes/answers')
  , searchRoutes = require('./routes/search')
  , http = require('http')
  , path = require('path')
  , battleAnswerProvider = require('./battle_answer_provider').battleAnswerProvider
  , passport = require('passport')
  , flash = require('connect-flash')
  , LocalStrategy = require('passport-local').Strategy
  , passportHelper = require('./passport_helper');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  passportHelper.findUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      passportHelper.findUserByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/account', passportHelper.ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', authenticationRoutes.login);
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
  res.redirect('/');
});
app.get('/logout', authenticationRoutes.logout);

app.get('/answers', passportHelper.ensureAuthenticated, answerRoutes.index);
app.get('/answer/new', passportHelper.ensureAuthenticated, answerRoutes.new);
app.post('/answer/new', passportHelper.ensureAuthenticated, answerRoutes.create);
app.get('/answer/:id/edit', passportHelper.ensureAuthenticated, answerRoutes.edit);
app.post('/answer/:id/edit', passportHelper.ensureAuthenticated, answerRoutes.update);
app.post('/answer/:id/delete', passportHelper.ensureAuthenticated, answerRoutes.delete);

app.get('/search/new', searchRoutes.new);
app.post('/search/new', searchRoutes.create);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
