const JsonService = require('../services/jsonService');
const usersService = new JsonService('users.json');

const login = (req, res) => {
    const { email, senha } = req.body;
    
    try {
        const usuarios = usersService.getAll();
        
        const usuarioEncontrado = usuarios.find(
            (user) => user.email === email && user.senha === senha
        );

        if (usuarioEncontrado) {
            res.status(200).json({ mensagem: 'Login aprovado!', nome: usuarioEncontrado.nome });
        } else {
            res.status(401).json({ erro: 'E-mail ou senha incorretos!' });
        }
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

module.exports = {
    login
};
