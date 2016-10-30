const express = require("express")
const session = require("express-session")
const favicon = require("serve-favicon")
const methodOverride = require("method-override")
const bodyParser = require("body-parser")
const multer = require("multer")
const logger = require("morgan")
const cookieParser = require("cookie-parser")
const	qt = require("quickthumb")
const	config = require("./config")

const router = express.Router()

module.exports = function(app, passport) {
  app.set("showStackError", true)

	// Only use logger for development environment
  if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"))
  }

  app.set("view engine", "ejs")
  app.engine(".html", require("ejs").renderFile)

	// The cookieParser should be above session
  app.use(cookieParser())

    // parse application/json
  app.use(bodyParser.json())

    // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: true}))

    // parse multipart/form-data
  app.use(multer())

  app.use(favicon(__dirname + "/../src/assets/images/favicon.ico"))
  app.use(methodOverride())

  app.use("/public", qt.static("/public"))

	// Express/Mongo session storage
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: config.sessionSecret,
  }))

	// Use passport session
  app.use(passport.initialize())
  app.use(passport.session())

	// Assume "not found" in the error msgs is a 404. this is somewhat
	// silly, but valid, you can do whatever you like, set properties,
	// use instanceof etc.
  router.use(function(err, req, res, next) {

			// Treat as 404
    if (~err.message.indexOf("not found")) return next()

			// Log it
    console.error(err.stack)

			// Error page
    res.status(500).render("500", {
      error: err.stack,
    })
  })

	// Assume 404 since no middleware responded
  router.use(function(req, res) {
    res.status(404).render("404", {
      url: req.originalUrl,
      error: "Not found",
    })
  })
}
