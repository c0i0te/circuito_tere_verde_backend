const express = require('express');
const router = express.Router();
const biodiversidadeController = require('../controllers/biodiversidadeController');
const upload = require('../config/multer');

router.get('/', biodiversidadeController.getBiodiversidade);
router.get('/:id', biodiversidadeController.getBiodiversidadeById);
router.post('/', upload.single('imagem'), biodiversidadeController.createBiodiversidade);
router.put('/:id', upload.single('imagem'), biodiversidadeController.updateBiodiversidade);
router.delete('/:id', biodiversidadeController.deleteBiodiversidade);

module.exports = router;
