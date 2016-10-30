"use strict"

/**
 * Module dependencies.
 */
const mongoose = require("mongoose")

const	Schema = mongoose.Schema

/**
 * Article Schema
 */
const UserEventSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  startsAt: {
    type: Date,
    default: Date.now,
  },
  endsAt: {
    type: Date,
    default: Date.now,
    trim: true,
  },
  title: {
    type: String,
    default: "",
    trim: true,
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
  type: {
    type: String,
    trim: true,
  },
  eventType: {
    type: String,
    trim: true,
  },
  recursOn: {
    type: String,
    trim: true,
  },
  editable:{
    type: Boolean,
  },
  deletable:{
    type: Boolean,
  },
  incrementsBadgeTotal:{
    type: String,
    trim: true,
  },
  location: {
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
  },
  guest: [{
    type : mongoose.Schema.ObjectId, ref : "User",
  }],
  guestUnavailable: [{
    type : mongoose.Schema.ObjectId, ref : "User",
  }],
  subType: {
    type: String,
    default: "classic",
  },
  matchId: {
    type: String,
  },
  comments: [new Schema({
    created: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      default: "",
    },
    replies: [new Schema({
      created: {
        type: Date,
        default: Date.now,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        default: "",
      },
    })],
  })],
})

/**
 * Validations
 */
// UserEventSchema.path("content").validate(function(title) {
//     return title.length;
// }, "Content cannot be blank");

/**
 * Statics
 */
UserEventSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id,
  }).populate("userEvent", "name username avatar").exec(cb)
}

module.exports = mongoose.model("UserEvent", UserEventSchema)
