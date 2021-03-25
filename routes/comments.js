const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

//=================================
//             Comments
//=================================
router.post("/addcomment", (req, res) => {
  const comment = new Comment(req.body);
  comment.save((error, comment) => {
    if (error) {
      return res.status(400).send(error)
    }
    Comment.find({ "_id": comment._id })
      .populate('writer')
      .exec((error, result) => {
        if (error) {
          return res.status(400).send(error)
        }
        return res.status(200).json({
          success: true,
          comment: result,
        })
      })
  })
});


router.post("/allcomments", (req, res) => {
  Comment.find({ "postId": req.body.postId })
    .populate('writer')
    .exec((error, comments) => {
      if (error) {
        return res.status(400).send(error)
      }
      return res.status(200).json({
        success: true,
        comments: comments,
      })
  })
});



module.exports = router;