var express = require('express')
  , frontPageRoutes = require('./routes/index')
  , authenticationRoutes = require('./routes/authentication')
  , answerRoutes = require('./routes/answers')
  , searchRoutes = require('./routes/search')
  , userRoutes = require('./routes/users')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , flash = require('connect-flash')
  , LocalStrategy = require('passport-local').Strategy
  , passportHelper = require('./passport_helper');

var MongoStore = require('connect-mongo')(express);

mongoose.connect('mongodb://localhost/node-mongo-battle-answer');

var User = require('./models/user.js');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, function(err, user) { 
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      User.findOne({ username: username }, function(err, user) { 
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
  app.use(express.session({ secret: 'keyboard cat', store: new MongoStore({ db: 'node-mongo-battle-answer' }) }));
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

app.get('/', frontPageRoutes.index);

app.get('/account', passportHelper.ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', authenticationRoutes.login);
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
  res.redirect('/');
});
app.get('/logout', authenticationRoutes.logout);

app.get('/answers', passportHelper.ensureAuthenticated, answerRoutes.index);
app.get('/answers/new', passportHelper.ensureAuthenticated, answerRoutes.new);
app.post('/answers/new', passportHelper.ensureAuthenticated, answerRoutes.create);
app.get('/answers/:id/edit', passportHelper.ensureAuthenticated, answerRoutes.edit);
app.post('/answers/:id/edit', passportHelper.ensureAuthenticated, answerRoutes.update);
app.post('/answers/:id/delete', passportHelper.ensureAuthenticated, answerRoutes.delete);

app.get('/users', passportHelper.ensureAuthenticated, userRoutes.index);
app.get('/users/new', passportHelper.ensureAuthenticated, userRoutes.new);
app.post('/users/new', passportHelper.ensureAuthenticated, userRoutes.create);
app.get('/users/:id/edit', passportHelper.ensureAuthenticated, userRoutes.edit);
app.post('/users/:id/edit', passportHelper.ensureAuthenticated, userRoutes.update);
app.post('/users/:id/delete', passportHelper.ensureAuthenticated, userRoutes.delete);

app.get('/search/new', searchRoutes.new);
app.post('/search/new', searchRoutes.create);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
