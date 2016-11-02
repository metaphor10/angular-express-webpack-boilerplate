"use strict"

/**
 * Module dependencies.
 */
const mongoose = require("mongoose")

const	Schema = mongoose.Schema


/**
 * Suggestion Schema
 */
const VoteSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    default: "",
    trim: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  yes: [],
  no: [],
  blank: [],
})

/**
 * Statics
 */
VoteSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id,
  }).populate("user", "name username avatar").exec(cb)
}

mongoose.model("Vote", VoteSchema)
