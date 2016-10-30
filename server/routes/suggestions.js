"use strict"

// Articles routes use suggestions controller
const suggestions = require("../controllers/suggestions")
const authorization = require("./middlewares/authorization")

// Article authorization helpers
const hasAuthorization = function(req, res, next) {
  if (req.suggestion.user.id !== req.user.id) {
    return res.send(401, "User is not authorized")
  }
  next()
}

module.exports = function(app) {

  app.get("/suggestions", suggestions.all)
  app.post("/suggestions", authorization.requiresLogin, suggestions.create)
  app.get("/suggestions/:suggestionId", suggestions.show)
  app.put("/suggestions/:suggestionId", authorization.requiresLogin, suggestions.update)
  app.delete("/suggestions/:suggestionId", authorization.requiresLogin, suggestions.destroy)

	// Finish with setting up the suggestionId param
  app.param("suggestionId", suggestions.suggestion)
}
