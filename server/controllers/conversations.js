"use strict"

/**
 * Module dependencies.
 */
const _ = require("lodash")
const mongoose = require("mongoose")

const Conversation = mongoose.model("Conversation")

/**
 * Find conversation by id
 */
exports.conversation = function(req, res, next, id) {
  Conversation.load(id, function(err, conversation) {
    if (err) return next(err)
    if (!conversation) return next(new Error("Failed to load conversation " + id))
    req.conversation = conversation
    next()
  })
}

/**
 * Create a conversation
 */
exports.create = function(req, res) {

  const conversation = new Conversation(req.body)
  conversation.save(function(err) {

    if (err) {
      console.log("Error when create conversation: " + err)
      return res.send("users/signup", {
        errors: err.errors,
        conversation: conversation,
      })
    } else {
      res.jsonp(conversation)
    }
  })
}

/**
 * Update a conversation
 */
exports.update = function(req, res) {

  Conversation.load(req.body._id, function(err, conversation) {
    if (err) return next(err)

    conversation.messages.push(req.body.messages[req.body.messages.length - 1])
    conversation.save(function(err) {
      if (err) {
        return res.send("users/signup", {
          errors: err.errors,
          conversation: conversation,
        })
      } else {
        res.jsonp(conversation)
      }
    })

  })
}

/**
 * Delete an conversation
 */
exports.destroy = function(req, res) {

  const conversation = req.conversation
  conversation.remove(function(err) {
    if (err) {
      return res.send("users/signup", {
        errors: err.errors,
        conversation: conversation,
      })
    } else {
      res.jsonp(conversation)
    }
  })
}

/**
 * Show an conversation
 */
exports.show = function(req, res) {
  res.jsonp(req.conversation)
}

/**
 * List of conversations
 */
exports.all = function(req, res) {

  const messageLimitCount = 30

  Conversation.find({$or: [
    {
      users: {
        $in: [req.user.id],
      },
    },
    {
      users: [],
    },
  ]})
		.sort("-created")
		.populate("users", "_id name username avatar exclude")
		.populate("messages.user").exec(function(err, conversations) {

  if (err) {
    res.send("error", {
      status: 500,
    })
  } else {

    _.each(conversations, function(conversation) {
      conversation.messages = conversation.messages.slice(Math.max(conversation.messages.length - messageLimitCount, 0))
    })

    res.jsonp(conversations)
  }

})
}
