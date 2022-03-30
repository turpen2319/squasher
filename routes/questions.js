const express = require('express');
const router = express.Router();
const questionsCtrl = require('../controllers/questions');
const isLoggedIn = require('../config/auth');

router.get('/', questionsCtrl.index);
router.get('/:id', questionsCtrl.show);
router.get('/:id/edit', isLoggedIn, questionsCtrl.edit);

router.post('/', isLoggedIn, questionsCtrl.create);

router.delete('/:id', isLoggedIn, questionsCtrl.delete);
router.put('/:id', isLoggedIn, questionsCtrl.update);

module.exports = router;