const JsonService = require('../services/jsonService');
const trilhasService = new JsonService('trilhas.json');

const getTrilhas = (req, res) => {
  try {
    res.status(200).json(trilhasService.getAll());
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const getTrilhaById = (req, res) => {
  try {
    const trilha = trilhasService.getById(req.params.id);
    if (!trilha) return res.status(404).json({ erro: 'Trilha não encontrada.' });
    res.status(200).json(trilha);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const createTrilha = (req, res) => {
  try {
    const { nome, dificuldade, distancia_km, descricao, mapa_url } = req.body;
    const imagem = req.file ? req.file.filename : null;
    
    const novaTrilha = trilhasService.create({ nome, dificuldade, distancia_km, descricao, imagem, mapa_url });
    res.status(201).json({ mensagem: 'Trilha criada com sucesso!', trilha: novaTrilha });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const updateTrilha = (req, res) => {
  try {
    const { nome, dificuldade, distancia_km, descricao, mapa_url } = req.body;
    const updateData = { nome, dificuldade, distancia_km, descricao, mapa_url };
    
    if (req.file) updateData.imagem = req.file.filename;

    const trilhaAtualizada = trilhasService.update(req.params.id, updateData);
    if (!trilhaAtualizada) return res.status(404).json({ erro: 'Trilha não encontrada.' });
    
    res.status(200).json({ mensagem: 'Trilha atualizada!', trilha: trilhaAtualizada });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const deleteTrilha = (req, res) => {
  try {
    const deletado = trilhasService.delete(req.params.id);
    if (!deletado) return res.status(404).json({ erro: 'Trilha não encontrada.' });
    res.status(200).json({ mensagem: 'Trilha deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

module.exports = { getTrilhas, getTrilhaById, createTrilha, updateTrilha, deleteTrilha };
