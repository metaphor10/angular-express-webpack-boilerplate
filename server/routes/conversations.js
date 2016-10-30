"use strict"

// Articles routes use links controller
const conversations = require("../controllers/conversations")
const authorization = require("./middlewares/authorization")

module.exports = function(app) {

  app.get("/conversation", conversations.all)
  app.post("/conversation", conversations.create)
  app.get("/conversation/:conversationId", conversations.show)
  app.put("/conversation/:conversationId", conversations.update)

    // Finish with setting up the conversationId param
  app.param("conversationId", conversations.conversation)

}
