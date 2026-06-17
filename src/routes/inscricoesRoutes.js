const express = require('express');
const router = express.Router();
const inscricoesController = require('../controllers/inscricoesController');

router.get('/', inscricoesController.getInscricoes);
router.post('/', inscricoesController.createInscricao);

module.exports = router;
