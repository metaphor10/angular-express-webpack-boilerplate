"use strict"

const path = require("path")

module.exports = {
  db: "mongodb://localhost/app-dev",
  app: {
    name: "appName",
  },
  root: path.normalize(__dirname + "/../"),
  port: process.env.PORT || 80,
  sessionSecret: "APP",
  sessionCollection: "sessions",
  uploadDirectory: "public/img/users/",
  cacheDirectoryX300: "public/.cache/crop/300/img/users/",
  cacheDirectoryX100: "public/.cache/crop/100x100/img/users/",
}
