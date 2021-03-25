const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//=================================
//             Likes && Dislike
//=================================

router.post("/getLikes", (req, res) => {
  let payload = {};

  if (req.body.videoId) {
    payload = { videoId: req.body.videoId }
  } else {
    payload = { commentId: req.body.commentId }
  }

  Like.find(payload)
    .exec((error, likes) => {
      if (error) {
        return res.status(400).send(error)
      }

      return res.status(200).json({
        success: true,
        likes: likes,
      })
    })
});

router.post("/getDislikes", (req, res) => {
  let payload = {};

  if (req.body.videoId) {
    payload = { videoId: req.body.videoId }
  } else {
    payload = { commentId: req.body.commentId }
  }

  Dislike.find(payload)
    .exec((error, dislikes) => {
      if (error) {
        return res.status(400).send(error)
      }

      return res.status(200).json({
        success: true,
        dislikes: dislikes,
      })
    })
});

router.post("/uplike", (req, res) => {
  let payload = {};

  if (req.body.videoId) {
    payload = { videoId: req.body.videoId, userId: req.body.userId }
  } else {
    payload = { commentId: req.body.commentId, userId: req.body.userId }
  }
  const like = new Like(req.body);

  like.save((error, result) => {
    if (error) {
      return res.status(400).send(error)
    }
    Dislike.findOneAndDelete(payload)
      .exec((error, resut) => {
        if (error) {
          return res.status(400).send(error)
        }
        return res.status(200).json({ success: true })
      })
  })

});

router.post("/downlike", (req, res) => {
  let payload = {};


  if (req.body.videoId) {
    payload = { videoId: req.body.videoId, userId: req.body.userId }
  } else {
    payload = { commentId: req.body.commentId, userId: req.body.userId }
  }

  Like.findOneAndDelete(payload)
    .exec((error, result) => {
      if (error) {
        return res.status(400).send(error)
      }
      return res.status(200).json({ success: true })
    })
});

router.post("/initDislike", (req, res) => {
  let payload = {};


  if (req.body.videoId) {
    payload = { videoId: req.body.videoId, userId: req.body.userId }
  } else {
    payload = { commentId: req.body.commentId, userId: req.body.userId }
  }

  Dislike.findOneAndDelete(payload)
    .exec((error, result) => {
      if (error) {
        return res.status(400).send(error)
      }
      return res.status(200).json({ success: true })
    })

});

router.post("/upDislike", (req, res) => {
  let payload = {};


  if (req.body.videoId) {
    payload = { videoId: req.body.videoId, userId: req.body.userId }
  } else {
    payload = { commentId: req.body.commentId, userId: req.body.userId }
  }
  const dislike = new Dislike(req.body);

  dislike.save((error, result) => {
    if (error) {
      return res.status(400).send(error)
    }
    Like.findOneAndDelete(payload)
      .exec((error, resut) => {
        if (error) {
          return res.status(400).send(error)
        }
        return res.status(200).json({ success: true })
      })
  })

});


module.exports = router;