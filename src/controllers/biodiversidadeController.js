const JsonService = require('../services/jsonService');
const biodiversidadeService = new JsonService('biodiversidade.json');

const getBiodiversidade = (req, res) => {
  try {
    res.status(200).json(biodiversidadeService.getAll());
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const getBiodiversidadeById = (req, res) => {
  try {
    const item = biodiversidadeService.getById(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Item de biodiversidade não encontrado.' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const createBiodiversidade = (req, res) => {
  try {
    const { categoria, especie, status_conservacao, descricao } = req.body;
    const imagem = req.file ? req.file.filename : null;
    
    const novoItem = biodiversidadeService.create({ categoria, especie, status_conservacao, descricao, imagem });
    res.status(201).json({ mensagem: 'Item de biodiversidade criado com sucesso!', item: novoItem });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const updateBiodiversidade = (req, res) => {
  try {
    const { categoria, especie, status_conservacao, descricao } = req.body;
    const updateData = { categoria, especie, status_conservacao, descricao };
    
    if (req.file) updateData.imagem = req.file.filename;

    const itemAtualizado = biodiversidadeService.update(req.params.id, updateData);
    if (!itemAtualizado) return res.status(404).json({ erro: 'Item de biodiversidade não encontrado.' });
    
    res.status(200).json({ mensagem: 'Item de biodiversidade atualizado!', item: itemAtualizado });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const deleteBiodiversidade = (req, res) => {
  try {
    const deletado = biodiversidadeService.delete(req.params.id);
    if (!deletado) return res.status(404).json({ erro: 'Item de biodiversidade não encontrado.' });
    res.status(200).json({ mensagem: 'Item de biodiversidade deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

module.exports = { getBiodiversidade, getBiodiversidadeById, createBiodiversidade, updateBiodiversidade, deleteBiodiversidade };
