// imports
const mongoose = require("mongoose")

const Schema = mongoose.Schema

// Album Schema
const albumSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  coverPicPath: {
    type: String,
  },
  photoList: [new Schema({
    id: {
      type: String,
    },
    filepath: {
      type: String,
    },
    name: {
      type: String,
    },
  })],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
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

// Export album model
module.exports = mongoose.model("Album", albumSchema)
