const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const answersCtrl = require('../controllers/answers');


router.post('/questions/:id/answers', answersCtrl.create);

router.put('/questions/:questionId/answers/:answerId', answersCtrl.update);

module.exports = router;