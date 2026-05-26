const JsonService = require('../services/jsonService');
const eventosService = new JsonService('eventos.json');

const getEventos = (req, res) => {
  try {
    res.status(200).json(eventosService.getAll());
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const getEventoById = (req, res) => {
  try {
    const evento = eventosService.getById(req.params.id);
    if (!evento) return res.status(404).json({ erro: 'Evento não encontrado.' });
    res.status(200).json(evento);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const createEvento = (req, res) => {
  try {
    const { titulo, data, descricao } = req.body;
    const imagem = req.file ? req.file.filename : null;
    
    const novoEvento = eventosService.create({ titulo, data, descricao, imagem });
    res.status(201).json({ mensagem: 'Evento criado com sucesso!', evento: novoEvento });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const updateEvento = (req, res) => {
  try {
    const { titulo, data, descricao } = req.body;
    const updateData = { titulo, data, descricao };
    
    if (req.file) updateData.imagem = req.file.filename;

    const eventoAtualizado = eventosService.update(req.params.id, updateData);
    if (!eventoAtualizado) return res.status(404).json({ erro: 'Evento não encontrado.' });
    
    res.status(200).json({ mensagem: 'Evento atualizado!', evento: eventoAtualizado });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const deleteEvento = (req, res) => {
  try {
    const deletado = eventosService.delete(req.params.id);
    if (!deletado) return res.status(404).json({ erro: 'Evento não encontrado.' });
    res.status(200).json({ mensagem: 'Evento deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

module.exports = { getEventos, getEventoById, createEvento, updateEvento, deleteEvento };
