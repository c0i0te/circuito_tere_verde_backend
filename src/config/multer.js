const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Envia para o Frontend conforme restrição original
        cb(null, path.join(__dirname, '../../public/images'));
    },
    filename: function (req, file, cb) {
        const nomeUnico = Date.now() + '-' + file.originalname;
        cb(null, nomeUnico);
    }
});

module.exports = multer({ storage });
