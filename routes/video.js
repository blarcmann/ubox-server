const express = require('express');
const router = express.Router();
const multer = require('multer');
const FFmpeg = require('fluent-ffmpeg')
const { Video } = require("../models/Video");
const { auth } = require("../middlewares/auth");

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
      count: 4,
      folder: 'uploads/thumbnails',
      size: '320x240',
      filename: 'thumbnail-%b.png' 
    });
});

router.post("/uploadvideo", (req, res) => {
  const video = new Video(req.body);
  video.save((error, video) => {
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

module.exports = router;