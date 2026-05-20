const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const upload = require('../config/multer');

router.get('/', eventosController.getEventos);
router.get('/:id', eventosController.getEventoById);
router.post('/', upload.single('imagem'), eventosController.createEvento);
router.put('/:id', upload.single('imagem'), eventosController.updateEvento);
router.delete('/:id', eventosController.deleteEvento);

module.exports = router;
