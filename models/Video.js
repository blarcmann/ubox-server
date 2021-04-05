const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
  writer: {
    type: Schema.Types.ObjectId,
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
    default: 1,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  duration: {
    type: String,
  },
  thumbnail: {
    type: String,
  }
}, { timestamps: true })

// yemi - ADMINpassword

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }
