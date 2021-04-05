const express = require('express');
const router = express.Router();
const multer = require('multer');
const FFmpeg = require('fluent-ffmpeg')
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Video
//=================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

var upload = multer({ storage: storage }).single('file')

router.post("/uploadfile", (req, res) => {
  upload(req, res, error => {
    if (error) {
      return res.json({
        success: false,
        error
      })
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename
    })
  })
});

router.get("/all", (req, res) => {
  Video.find()
    .populate('writer')
    .exec((error, videos) => {
      if (error) {
        return res.status(400).send({ success: false, error })
      }
      res.status(200).json({
        success: true,
        videos,
      })
    })
});

router.post("/thumbnail", (req, res) => {

  let thumbnailsPath = '';
  let duration = '';

  FFmpeg.ffprobe(req.body.filePath, (err, metadata) => {
    duration = metadata.format.duration;
  })

  FFmpeg(req.body.filePath)
    .on('filenames', (files) => {
      console.log('files', files)
      thumbnailsPath = 'uploads/thumbnails/' + files[0]
    })
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function () {
      res.json({
        success: true,
        thumbnailsPath: thumbnailsPath,
        duration: duration,
      })
    })
    .screenshots({
      count: 1,
      folder: 'uploads/thumbnails',
      filename: 'thumbnail-%b.png'
    });
});

router.post("/uploadvideo", (req, res) => {
  const video = new Video(req.body);
  video.save((error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        err
      })
    }
    return res.status(200).json({
      success: true,
    })
  })
});

router.post("/getvideo", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate('writer')
    .exec((error, video) => {
      if (error) {
        return res.status(400).send(error)
      }
      res.status(200).json({
        success: true,
        video
      })
    })
});

router.post("/getSubVideos", (req, res) => {
  Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((error, subscribers) => {
      if (error) {
        return res.status(400).send(error)
      }
      let subscribedUsers = [];
      subscribers.map((subscriber, i) => {
        subscribedUsers.push(subscriber.userTo)
      })

      Video.find({ writer: { $in: subscribedUsers } })
        .populate('writer')
        .exec((error, videos) => {
          if (error) {
            return res.status(400).send(error)
          }
          return res.status(200).json({
            success: true,
            videos
          })
        })

    })
});

router.post("/viewCount", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .exec((error, video) => {
      if (error) {
        return res.status(400).send(error)
      }
      video.views += 1;
      video.save()
      res.status(200).json({
        success: true
      })
    })

})

router.post("/like", (req, res) => {
  const { userId, videoId } = req.body;
  Video.findOne({ _id: videoId })
    .exec((error, video) => {
      if (error) {
        return res.status(400).send(error)
      }
      if (video && video.likes && video.likes.length > 0) {
        for (let i = 0; i < video.likes.length; i++) {
          if (video.likes[i].toString() === userId.toString()) {
            video.likes.splice(i, 1);
          }
        }
        video.save()
        return res.status(200).json({ success: true })
      } else {
        video.likes.push(userId);
        video.save();
        return res.status(200).json({ success: true })
      }
    })
})

router.post("/dislike", (req, res) => {
  const { userId, videoId } = req.body;
  Video.findOne({ _id: videoId })
    .exec((error, video) => {
      if (error) {
        return res.status(400).send(error)
      }
      if (video && video.dislikes && video.dislikes.length > 0) {
        for (let i = 0; i < video.dislikes.length; i++) {
          if (video.dislikes[i].toString() === userId.toString()) {
            video.dislikes.splice(i, 1);
          }
        }
        video.save()
        return res.status(200).json({ success: true })
      } else {
        video.dislikes.push(userId);
        video.save();
        return res.status(200).json({ success: true })
      }
    })

})




module.exports = router;