"use strict"

// userEvent routes use userEvent controller
const userEvents = require("../controllers/userEvent")
const authorization = require("./middlewares/authorization")

// userEvent authorization helpers
const hasAuthorization = function(req, res, next) {
  if (req.userEvent.user.toString() !== req.user._id.toString()) {
    return res.send(401, "User is not authorized")
  }
  next()
}

module.exports = function(app) {
  app.get("/userEvent/:userEventId", userEvents.show)
  app.get("/userEvent", userEvents.all)
  app.post("/userEvent", authorization.requiresLogin, userEvents.create)
  app.put("/userEvent/:userEventId", userEvents.update)
  app.delete("/userEvent/:userEventId", userEvents.destroy)

	// Finish with setting up the userEventId param
  app.param("userEventId", userEvents.userEvent)
}
