const express = require("express");
const router = express.Router();

//bring in models

let Article = require("../models/article");

//add article route
router.get("/add", (req, res) =>
  res.render("add_article", {
    title: "Add article "
  })
);

// add submit post route
router.post("/add", function(req, res) {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("author", "Author is required").notEmpty();
  req.checkBody("body", "Body is required").notEmpty();

  //Get errors
  let errors = req.validationErrors();

  if (errors) {
    res.render("add_article", {
      errors: errors,
      title: "Add Article"
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash("success", "Article added");
        res.redirect("/");
      }
    });
  }
});

//Load Edit
router.get("/edit/:id", function(req, res) {
  Article.findById(req.params.id, function(error, article) {
    res.render("edit_article", {
      title: "Edit",
      article: article
    });
  });
});

// Update submit
router.post("/edit/:id", function(req, res) {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = { _id: req.params.id };

  Article.update(query, article, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article updated");
      res.redirect("/");
    }
  });
});

//Delete post
router.delete("/:id", function(req, res) {
  let query = { _id: req.params.id };

  Article.remove(query, function(err) {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});

//get single article
router.get("/:id", function(req, res) {
  Article.findById(req.params.id, function(error, article) {
    console.log(article);
    //Article.findById({'_id':req.params.id}, function(error,article) {
    //Article.findById(mongoose.Types.ObjectId(req.params.id), function (err, article){
    res.render("article", {
      article: article
    });
  });
});

module.exports = router;
