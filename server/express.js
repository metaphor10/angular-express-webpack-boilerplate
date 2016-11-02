const express = require("express")
const session = require("express-session")
const favicon = require("serve-favicon")
const methodOverride = require("method-override")
const bodyParser = require("body-parser")
const multer = require("multer")
const logger = require("morgan")
const cookieParser = require("cookie-parser")
const serveStatic = require("serve-static")
const	qt = require("quickthumb")
const	config = require("./config")

const router = express.Router()
const serverPublicDir = "/public"
const assetDirectory = __dirname + "/../src/assets/"
const faviconPath = assetDirectory + "/images/favicon.ico"

module.exports = function(app, passport) {
  app.set("showStackError", true)

	// Only use logger for development environment
  if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"))
  }

  // Define view engine to html with ejs
  app.set("view engine", "ejs")
  app.engine(".html", require("ejs").renderFile)

  // Express utilities
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(multer())
  app.use(methodOverride())

  // Assets rendering
  app.use(serveStatic(assetDirectory))
  app.use(serverPublicDir, qt.static(serverPublicDir))
  app.use(favicon(faviconPath))

	// Express/Mongo session storage
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: config.sessionSecret,
  }))

	// Use passport session
  app.use(passport.initialize())
  app.use(passport.session())

	// 500 error page
  router.use(function(err, req, res, next) {
    if (~err.message.indexOf("not found")) return next()
    console.error(err.stack)
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
