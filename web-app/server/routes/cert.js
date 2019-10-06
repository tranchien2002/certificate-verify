const router = require('express').Router();
const Cert = require('../models/Cert');
const mongoose = require('mongoose');

// # GET certificate by id
router.get('/:_id', async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    Cert.findById(req.params._id, (err, cert) => {
      if (!cert) {
        res.json({
          success: false,
          msg: "certificate doesn't exit"
        });
      } else {
        res.json({
          success: true,
          cert: cert
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: "certificate doesn't exit"
    });
  }
});

// #POST create certificate
// TODO check role for who can create certificate
router.post('/new', async (req, res) => {
  let cert = new Cert({
    name: req.body.name,
    course: req.body.course,
    issueDate: req.body.issueDate,
    signature: req.body.signature
  });

  await cert.save((err, cert) => {
    // return _id
    res.json({
      success: true,
      cert_id: cert._id
    });
  });
});

module.exports = router;
