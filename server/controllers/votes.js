"use strict"

const moment = require("moment")
const _ = require("lodash")
const mongoose = require("mongoose")

const Vote = mongoose.model("Vote")
const Article = mongoose.model("Article")


/**
 * Find suggestion by id
 */
exports.suggestion = function(req, res, next, id) {
  Vote.load(id, function(err, suggestion) {
    if (err) return next(err)
    if (!suggestion) return next(new Error("Failed to load suggestion " + id))
    req.suggestion = suggestion
    next()
  })
}

/**
 * Create a suggestion
 */
exports.create = function(req, res) {
  const suggestion = new Vote(req.body)
  suggestion.user = req.user
  suggestion.save(function(err) {
    console.log(err)
    if (err) {
      return res.send("users/signup", {
        errors: err.errors,
        suggestion: suggestion,
      })
    } else {
      res.jsonp(suggestion)
    }
  })
}

/**
 * Update a suggestion
 */
exports.update = function(req, res) {
  let suggestion = req.suggestion
  suggestion = _.extend(suggestion, req.body)
  suggestion.save(function(err) {
    if (err) {
      return res.send("users/signup", {
        errors: err.errors,
        suggestion: suggestion,
      })
    } else {
      res.jsonp(suggestion)
    }
  })
}

/**
 * Delete an suggestion
 */
exports.destroy = function(req, res) {
  const suggestion = req.suggestion
  suggestion.remove(function(err) {
    if (err) {
      return res.send("users/signup", {
        errors: err.errors,
        suggestion: suggestion,
      })
    } else {
      res.jsonp(suggestion)
    }
  })
}

/**
 * Show a suggestion
 */
exports.show = function(req, res) {
  res.jsonp(req.suggestion)
}

/**
 * List of suggestions
 */
exports.all = function(req, res) {

  const perPage = req.query.perPage
  const page = req.query.page

  Vote.find({})
		.sort("-created")
		.limit(perPage)
		.skip(perPage * page)
		.populate("user", "_id name username avatar")
		.exec(function(err, suggestions) {
  if (err) {
    res.render("error", {
      status: 500,
    })
  } else {
    res.jsonp(suggestions)
  }
})
}

/**
 * Create article from ended suggestion to see results
 **/
exports.closeVotes = function() {

  const date = moment().subtract(1, "months").toISOString()

  Vote.find({
    "created": {
      "$lt": date,
    },
  })
		.sort("-created")
		.exec(function(err, suggestions) {

  if (err) {
    console.warn("Error when to fetch suggestions " + err)
  } else {
    _.each(suggestions, function(suggestion) {

      const yes = []
      const no = []
      const blank = []

      const article = new Article({
        title: "Vote",
        user: suggestion.user,
        content: suggestion.content,
        type: "vote",
        comments: [],
        created: suggestion.created,
      })

      _.each(suggestion.yes, function(userId) {
        yes.push({
          user: userId,
        })
      })
      article.yes = yes

      _.each(suggestion.blank, function(userId) {
        blank.push({
          user: userId,
        })
      })
      article.blank = blank

      _.each(suggestion.no, function(userId) {
        no.push({
          user: userId,
        })
      })
      article.no = no

      article.save(function(err) {

        if (err) {
          console.warn("Error when trying to save new article " + err)
        } else {

          suggestion.remove(function(err) {
            if (err) {
              console.warn("Error when trying to remove suggestion " + err)
            } else {
              console.warn("Vote removed with success")
            }
          })
        }
      })
    })
  }
})
}
