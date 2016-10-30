"use strict"

/**
 * Module dependencies.
 */
const mongoose = require("mongoose")

const	Schema = mongoose.Schema


/**
 * Suggestion Schema
 */
const SuggestionSchema = new Schema({
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
SuggestionSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id,
  }).populate("user", "name username avatar").exec(cb)
}

mongoose.model("Suggestion", SuggestionSchema)
