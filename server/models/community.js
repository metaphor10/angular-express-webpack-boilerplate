"use strict"

/**
 * Module dependencies.
 */
const mongoose = require("mongoose")

const Schema = mongoose.Schema


/**
 * Article Schema
 */
const CommunitySchema = new Schema({
  name: String,
  users: [{
    user: {
      type: Schema.ObjectId,
      ref: "User",
    },
  }],
})

/**
 * Statics
 */
CommunitySchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id,
  }).populate("user", "name username").exec(cb)
}

mongoose.model("Community", CommunitySchema)
