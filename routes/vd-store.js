const express = require('express');
const router = express.Router();

const vdStoreController = require('../controllers/vd-store');
const validator = require('../middlewares/validator')

//ROUTE DEFINITIONS
router.get('/', vdStoreController.welcome)
router.post('/new', validator.validatePOSTBody, vdStoreController.addToStore);
router.get('/:key', vdStoreController.findByKey);
router.get('/:key/:timestamp', validator.validateGETBody, vdStoreController.findByKeyAndTimeStamp);

module.exports = router;