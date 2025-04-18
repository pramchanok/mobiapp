const express = require('express');
const router = express.Router();
const pushController = require('../controllers/push.controller');

router.post('/subscribe', pushController.subscribe);
router.post('/send', pushController.sendNotification);

module.exports = router;
