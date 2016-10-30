"use strict"

// Articles routes use articles controller
const comments = require("../controllers/comments")
const authorization = require("./middlewares/authorization")

// Albums authorization helpers
const hasAuthorization = function(req, res, next) {
  if (req.comment.user.id !== req.user.id) {
    return res.send(401, "User is not authorized")
  }
  next()
}

module.exports = function(app) {
  app.post("/comments", comments.addComment)
  app.get("/comments/:id", comments.findCommentById)
  app.get("/comments", comments.findAllComments)
  app.put("/comments/:id", comments.updateComment)
  app.post("/comments/:id", comments.updateComment)

	// get comments count
    	app.get("/commentsCount", comments.getItemsCount)

	// Finish with setting up the commentId param
  app.param("id", comments.comment)
}
