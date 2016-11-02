"use strict"

// Articles routes use articles controller
const articles = require("../controllers/articles")
const authorization = require("./middlewares/authorization")

module.exports = function(app) {

  app.get("/articles/:articleId", articles.show)
  app.get("/articles", articles.all)
  app.post("/articles", authorization.requiresLogin, articles.create)
  app.put("/articles/:articleId", authorization.requiresLogin, articles.update)
  app.delete("/articles/:articleId", authorization.requiresLogin, articles.destroy)

	// Finish with setting up the articleId param
  app.param("articleId", articles.article)
}
