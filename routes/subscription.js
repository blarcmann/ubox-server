const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscriptions
//=================================

router.post("/subNumber", (req, res) => {
  Subscriber.find({ "userTo": req.body.userTo })
    .exec((error, subs) => {
      if (error) {
        return res.status(400).send(error)
      }

      return res.status(200).json({
        success: true,
        subscribers: subs.length,
      })
    })
});

router.post("/subscribed", (req, res) => {
  Subscriber.find({ "userTo": req.body.userTo, "userFrom": req.body.userFrom })
    .exec((error, subs) => {
      if (error) {
        return res.status(400).send(error)
      }
      let result = false;
      if (subs.length !== 0) {
        result = true
      }
      return res.status(200).json({
        success: true,
        subscribed: result
      })
    })
});

router.post("/subscribe", (req, res) => {
  const subscribe = new Subscriber(req.body);
  subscribe.save((error, data) => {
    if (error) {
      return res.status(400).send(error)
    }
    return res.status(200).json({ success: true })
  })
});

router.post("/unsubscribe", (req, res) => {
  Subscriber.findOneAndDelete({ "userTo": req.body.userTo, "userFrom": req.body.userFrom })
    .exec((error, data) => {
      if (error) {
        return res.status(400).send(error)
      }
      return res.status(200).json({ success: true, data })
    })
});


module.exports = router;