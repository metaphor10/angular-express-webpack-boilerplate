"use strict"

// User routes use users controller
const users = require("../controllers/users")

module.exports = function(app, passport) {

  app.get("/signin", users.signin)
	// app.get( "/signup", users.signup );
  app.get("/signout", users.signout)

  app.get("/users", users.team)
  app.get("/users/me", users.me)
  app.get("/users/:userId", users.findOne)

	// Setting up the users api
	// app.post( "/users", users.create );

  app.put("/users/:userId", users.update)

	// Setting up the userId param
  app.param("userId", users.user)

	// Setting the local strategy route
  app.post("/users/session", passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }), users.session)

	// To know if user is authenticate
  app.post("/users/isFutureSessionValid", users.isFutureSessionValid)

}
