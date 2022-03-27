const express = require('express');
const router = express.Router();
const questionsCtrl = require('../controllers/questions');

router.get('/', questionsCtrl.index);
router.get('/:id', questionsCtrl.show);

router.post('/', questionsCtrl.create);


module.exports = router;