"use strict"

/**
* Module dependencies.
*/
const _ = require("lodash")
const mongoose = require("mongoose")

const Article = mongoose.model("Article")

/**
* Find article by id
*/
exports.article = function(req, res, next, id) {
  Article.findOne({
    "_id": id,
  })
	.populate("user", "name username avatar")
	.populate("comments.user", "_id name username avatar")
	.populate("comments.replies.user", "_id name username avatar")
	.populate("yes.user", "name username avatar")
	.populate("no.user", "name username avatar")
	.populate("blank.user", "name username avatar").exec(function(err, article) {
  if (err) return next(err)
  req.article = article
  next()
})
}

/**
* Create a article
*/
exports.create = function(req, res) {
  const article = new Article(req.body)
  article.user = req.user
  article.save(function(err) {
    if (err) {
      return res.send("users/signup", {
        errors: err.errors,
        article: article,
      })
    } else {
      res.jsonp(article)
    }
  })
}

/**
* Update a article
*/
exports.update = function(req, res) {
  let article = req.article
  article = _.extend(article, req.body)
  article.save(function(err) {
    if (err) {
      return res.send("users/signup", {
        errors: err.errors,
        article: article,
      })
    } else {
      res.jsonp(article)
    }
  })
}

/**
* Delete an article
*/
exports.destroy = function(req, res) {
  const article = req.article
  article.remove(function(err) {
    if (err) {
      return res.send("users/signup", {
        errors: err.errors,
        article: article,
      })
    } else {
      res.jsonp(article)
    }
  })
}

/**
* Show an article
*/
exports.show = function(req, res) {
  res.jsonp(req.article)
}

/**
* List of articles
*/
exports.all = function(req, res) {

  const query = (req.query.userId) ? {user: req.query.userId} : {}

  if (req.query.type && req.query.type !== "all") {
    query.type = req.query.type
  }

  if (req.query.search) {
    query.word = new RegExp(req.body.search, "i")
  }

  Article.find(query)
		.sort("-created")
		.populate("user", "_id name username avatar")
		.limit(20)
		.exec()
		.then(function(articles, err) {
  if (err) {
    res.render("error", {
      status: 500,
    })
  } else {
    res.jsonp(articles)
  }
})
}
