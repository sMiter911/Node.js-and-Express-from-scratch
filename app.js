const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');

//connect to db
mongoose.connect('mongodb://localhost/nodekb');
let db  = mongoose.connection;

//check for connrction
db.once('open', function(){
    console.log('Connected to MongoDB');
})

//check for db errors
db.on('error', function(err){
    console.log(err);
});

//init app
const app = express();

//bring in models

let Article = require('./models/article');


//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//home route
app.get('/', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }else{
            res.render('index', {
                title: 'Articles',  
                articles: articles
            });
        }
    });
});

//get single article
app.get('/article/:id', function(req, res){
    Article.findById(req.params.id, function(error,article) {
        console.log(article);
    //Article.findById({'_id':req.params.id}, function(error,article) {
    //Article.findById(mongoose.Types.ObjectId(req.params.id), function (err, article){
        res.render('article', {  
            article: article
        });
    });
});

//add article route
app.get('/articles/add', (req, res) => res.render('add_article', {
    title: 'Add article '
}));

// add submit post route
app.post('/articles/add', function(req, res){
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
          console.log(err);
          return;
      }else{
         res.redirect('/'); 
      }
    })

});

//Load Edit
app.get('/article/edit/:id', function(req, res){
    Article.findById(req.params.id, function(error,article) {
        res.render('edit_article', {  
            title: 'Edit',
            article: article
        });
    });
});

// Update submit
app.post('/articles/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}

    Article.update(query, article, function(err){
      if(err){
          console.log(err);
          return;
      }else{
         res.redirect('/'); 
      }
    })

});

app.delete('/article/:id', function(req, res){
    let query = {_id:req.params.id}

    Article.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    })
});


//start server
app.listen(3000, () => console.log('App listening on port 3000!'));