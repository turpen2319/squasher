const express = require('express');
const router = express.Router();
const questionsCtrl = require('../controllers/questions');

router.get('/', questionsCtrl.index);
router.get('/:id', questionsCtrl.show);

router.post('/', questionsCtrl.create);

router.delete('/:id', questionsCtrl.delete);
router.put('/:id', questionsCtrl.update);

module.exports = router;