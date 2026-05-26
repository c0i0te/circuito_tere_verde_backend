const express = require('express');
const router = express.Router();
const trilhasController = require('../controllers/trilhasController');
const upload = require('../config/multer');

router.get('/', trilhasController.getTrilhas);
router.get('/:id', trilhasController.getTrilhaById);
router.post('/', upload.single('imagem'), trilhasController.createTrilha);
router.put('/:id', upload.single('imagem'), trilhasController.updateTrilha);
router.delete('/:id', trilhasController.deleteTrilha);

module.exports = router;
