const fs = require('fs');
const path = require('path');

class JsonService {
  constructor(fileName) {
    this.filePath = path.join(__dirname, '..', 'data', fileName);
  }

  getAll() {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Erro ao ler ${this.filePath}:`, error);
      throw new Error('Falha interna ao acessar os dados.');
    }
  }

  getById(id) {
    const items = this.getAll();
    return items.find(item => item.id === parseInt(id));
  }

  create(data) {
    const items = this.getAll();
    const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    const newItem = { id: newId, ...data };
    items.push(newItem);
    this._save(items);
    return newItem;
  }

  update(id, data) {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === parseInt(id));
    if (index === -1) return null;

    // Atualiza mantendo o id original
    items[index] = { ...items[index], ...data, id: parseInt(id) };
    this._save(items);
    return items[index];
  }

  delete(id) {
    let items = this.getAll();
    const initialLength = items.length;
    items = items.filter(item => item.id !== parseInt(id));
    if (items.length === initialLength) return false;
    this._save(items);
    return true;
  }

  _save(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Erro ao salvar ${this.filePath}:`, error);
      throw new Error('Falha interna ao gravar os dados no servidor.');
    }
  }
}

module.exports = JsonService;
