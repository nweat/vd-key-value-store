const express = require('express');
const router = express.Router();

const vdStoreController = require('../controllers/vd-store');

router.get('/', function(req, res, next) {
  res.send('vd-store API');
});

router.post('/tea', vdStoreController.newKey);


module.exports = router;