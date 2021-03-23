const mongoose = require('mongoose');
const moment = require("moment");

const videoSchema = mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  privacy: {
    type: Number,
  },
  filePath: {
    type: String
  },
  category: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
  },
  thumbnail: {
    type: String,
  }
}, {timestamps: true})

// yemi - ADMINpassword

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }
