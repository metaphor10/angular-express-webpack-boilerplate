const mongoose = require("mongoose")
const _ = require("underscore")

const Comment = mongoose.model("Comment")

exports.comment = function(req, res, next) {
  Comment.findOne({
    _id: req.params.id,
  })
		.populate("user").exec(function(err, comment) {
  if (err) return next(err)
  req.comment = comment
  next()
})
}

exports.findAllComments = function(req, res) {
  const query = (req.query.userId) ? {
    user: req.query.userId,
  } : {}
  Comment.find(query).exec(function(err, comments) {
    res.send(comments)
  })
}

exports.findCommentById = function(req, res) {
  Comment.findOne({
    _id: req.params.id,
  })
		.populate("user").exec(function(err, comment) {
  if (err) console.log("error finding comment: " + err)
  res.send(comment)
})
}

exports.addComment = function(req, res) {
  const newComment = req.body
  newComment.user = req.user
  Comment.create(newComment, function(err, comment) {
    if (err) console.log("error: " + err)
    res.send(comment)
  })
}

exports.updateComment = function(req, res) {
  let comment = req.comment
  comment = _.extend(comment, req.body)
  comment.save(function(err, comment, numAffected) {
    if (err) console.log("Error saving comment: " + err)
    console.log(numAffected + " documents updated.")
    res.send(comment)
  })
}

/**
 * Count of comments
 */
exports.getItemsCount = function(req, res) {
  Comment.count({}).exec(function(err, count) {
    if (err) {
      res.render("error", {
        status: 500,
      })
    } else {
      res.jsonp({
        count: count,
      })
    }
  })
}
