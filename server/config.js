"use strict"

const path = require("path")

const rootPath = path.normalize(__dirname + "/../")

module.exports = {
  db: "mongodb://localhost/mean-dev",
  app: {
    name: "Les coqs soccer",
  },
  root: rootPath,
  port: process.env.PORT || 80,
  db: process.env.MONGOHQ_URL,

	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
  sessionSecret: "MEAN",
	// The name of the MongoDB collection to store sessions in
  sessionCollection: "sessions",

	// File upload
  uploadDirectory: "public/img/users/",
  cacheDirectoryX300: "public/.cache/crop/300/img/users/",
  cacheDirectoryX100: "public/.cache/crop/100x100/img/users/",
}
