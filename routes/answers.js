const express = require('express');
const router = express.Router();
const answersCtrl = require('../controllers/answers');


router.post('/questions/:id/answers', answersCtrl.create)

module.exports = router;