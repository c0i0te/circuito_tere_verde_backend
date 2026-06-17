const JsonService = require('../services/jsonService');
const inscricoesService = new JsonService('inscricoes.json');

const getInscricoes = (req, res) => {
  try {
    res.status(200).json(inscricoesService.getAll());
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const createInscricao = (req, res) => {
  try {
    const { evento, nome, email, telefone, idade, endereco } = req.body;
    
    // Validação simples de campos obrigatórios
    if (!evento || !nome || !email || !telefone || !idade || !endereco) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios para realizar a inscrição.' });
    }

    const novaInscricao = inscricoesService.create({ 
      evento, 
      nome, 
      email, 
      telefone, 
      idade: parseInt(idade), 
      endereco,
      dataCadastro: new Date().toISOString()
    });
    
    res.status(201).json({ mensagem: 'Inscrição realizada com sucesso!', inscricao: novaInscricao });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

module.exports = { getInscricoes, createInscricao };
