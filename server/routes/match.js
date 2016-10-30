"use strict"

// Articles routes use articles controller
const matchs = require("../controllers/match")
const authorization = require("./middlewares/authorization")

// Albums authorization helpers
const hasAuthorization = function(req, res, next) {
  if (req.match.user.id !== req.user.id) {
    return res.send(401, "User is not authorized")
  }
  next()
}

module.exports = function(app) {
  app.post("/matchs", matchs.addMatch)
  app.get("/matchs/:id", matchs.findMatchById)
  app.get("/matchs", matchs.findAllMatchs)
  app.put("/matchs/:id", matchs.updateMatch)
  app.post("/matchs/:id", matchs.updateMatch)
  app.delete("/matchs/:id", matchs.deleteMatch)

	// Finish with setting up the matchId param
  app.param("id", matchs.match)
}
