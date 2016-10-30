"use strict"

/**
 * Module dependencies.
 */
const mongoose = require("mongoose")

const Schema = mongoose.Schema


/**
 * Parameter Schema
 */
const ParameterSchema = new Schema({
  articleCategories: [{
    id: {
      type: Number,
    },
    value: {
      type: String,
      default: "",
      trim: true,
    },
    active: {
      type: Boolean,
    },
  }],
})

/**
 * Statics
 */
ParameterSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id,
  }).exec(cb)
}

mongoose.model("Parameter", ParameterSchema)
