"use strict"

// Articles routes use articles controller
const files = require("../controllers/files")
// var authorization = require("./middlewares/authorization");

module.exports = function(app) {
  app.post("/upload/photo", files.uploadPhoto)
}
