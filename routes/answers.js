const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const answersCtrl = require('../controllers/answers');
const isLoggedIn = require('../config/auth')


router.post('/questions/:id/answers', isLoggedIn, answersCtrl.create);

router.put('/questions/:questionId/answers/:answerId', isLoggedIn, answersCtrl.update);

module.exports = router;