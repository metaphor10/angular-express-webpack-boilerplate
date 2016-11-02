"use strict"

// Articles routes use suggestions controller
const votes = require("../controllers/votes")
const authorization = require("./middlewares/authorization")

// Article authorization helpers
const hasAuthorization = function(req, res, next) {
  if (req.suggestion.user.id !== req.user.id) {
    return res.send(401, "User is not authorized")
  }
  next()
}

module.exports = function(app) {

  app.get("/votes", votes.all)
  app.post("/votes", authorization.requiresLogin, votes.create)
  app.get("/votes/:suggestionId", votes.show)
  app.put("/votes/:suggestionId", authorization.requiresLogin, votes.update)
  app.delete("/votes/:suggestionId", authorization.requiresLogin, votes.destroy)

	// Finish with setting up the suggestionId param
  app.param("suggestionId", votes.suggestion)
}
