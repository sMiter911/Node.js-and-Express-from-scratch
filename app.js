const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport');
const config = require('./config/database');


//connect to db
mongoose.connect(config.database);
let db = mongoose.connection;

//check for connrction
db.once("open", function() {
  console.log("Connected to MongoDB");
});

//check for db errors
db.on("error", function(err) {
  console.log(err);
});

//init app
const app = express();

//bring in models

let Article = require("./models/article");

//load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// body parser middleware parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
    //cookie: { secure: true }
  })
);

//Express messages middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//Express validator middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

//Bring in passport config
require('./config/passport')(passport);
//Passport middlware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

//home route
app.get("/", function(req, res) {
  Article.find({}, function(err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles
      });
    }
  });
});

//router files
let articles = require('./routes/articles.js');
let users = require('./routes/users.js');
app.use('/articles',articles) ;
app.use('/users',users) ;



//start server
app.listen(3000, () => console.log("App listening on port 3000!"));
