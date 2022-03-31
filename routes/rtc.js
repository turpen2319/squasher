const express = require('express');
const router = express.Router();
const rtcCtrl = require('../controllers/rtc');
const isLoggedIn = require('../config/auth');


router.get('/', rtcCtrl.index);

router.get('/room', rtcCtrl.createRoom);
router.get('/room/:roomId', rtcCtrl.openRoom)

module.exports = router;