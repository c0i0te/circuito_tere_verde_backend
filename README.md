# 🌿 Circuito Terê Verde Online — Back-End

Projeto acadêmico desenvolvido para a **UNIFESO** como segunda etapa do MVP, integrando o front-end já apresentado a um servidor back-end funcional.

---

## 📖 Sobre o Projeto

O **Circuito Terê Verde Online** é uma plataforma digital informativa e gerenciável sobre os parques naturais, trilhas e a rica biodiversidade de Teresópolis - RJ. Desenvolvido inicialmente como um protótipo estático, o projeto agora conta com um ecossistema completo: uma interface amigável no **Front-End** conectada a um servidor robusto no **Back-End**, permitindo a gestão dinâmica de conteúdos por administradores homologados.

O objetivo principal é centralizar informações confiáveis sobre o ecoturismo local, facilitando o acesso para turistas e moradores, além de incentivar a educação ambiental de forma consciente.


---

## 🛠️ Tecnologias

### Front-End
- **HTML5 + CSS3** — estrutura semântica e layout responsivo
- **JavaScript (Vanilla JS)** — interatividade e consumo da API via `fetch`

### Back-End
- **Node.js** — ambiente de execução server-side
- **Express 5** — gerenciamento de rotas e middlewares
- **Multer 2** — upload e manipulação de imagens
- **JSON (arquivos locais)** — persistência de dados sem dependência de banco externo, mantendo o MVP leve e portátil

---

## 🏗️ Arquitetura

O back-end foi organizado seguindo o padrão **MVC**:

```
src/
├── models/       → leitura e escrita nos arquivos JSON
├── controllers/  → lógica de negócio
└── routes/       → endpoints da API

public/           → arquivos estáticos servidos pelo Express
css/              → estilos
js/               → scripts do front-end
images/           → imagens e assets
```

---

## ⚙️ Funcionalidades

### Área Pública
- Listagem dinâmica de trilhas com nível de dificuldade e recomendações
- Calendário de eventos ecológicos e oficinas ambientais
- Catálogo de fauna e flora da região

### Área Administrativa
Acessível via `/login.html`, protegida por credenciais cadastradas no sistema.

| Regra | Descrição |
|---|---|
| **RN01 — Autenticação** | Login com credenciais administrativas previamente cadastradas |
| **RN02 — Proteção de Rotas** | Endpoints sensíveis bloqueados para usuários não autenticados |
| **RN03 — Controle de Sessão** | Uso de `sessionStorage` no cliente para validação da sessão do administrador |
| **RN04 — Upload de Mídia** | Imagens nomeadas com prefixo `Date.now()` para evitar conflito de arquivos |
| **RN05 — IDs Automáticos** | Identificadores gerados automaticamente pelo servidor a cada novo cadastro |

O administrador possui **CRUD completo** de Trilhas, Eventos e Itens de Biodiversidade.

---

## 🚀 Como executar localmente

**Pré-requisito:** ter o [Node.js](https://nodejs.org/) instalado.

```bash
# 1. Clone o repositório
git clone https://github.com/c0i0te/circuito_tere_verde_backend.git
cd circuito_tere_verde_backend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start
```

Acesse **http://localhost:3000** no navegador.

---

## 👥 Equipe

| Nome | E-mail |
|---|---|
| Rafael Branco de Barros | rafaelb87@gmail.com |
| Carlos Rodrigo Paim de Oliveira | rodrigocrf.oliveira@gmail.com |
| Johann Matheus Xavier | johanndetere@gmail.com |
| Ian Pires Miziara | ianpiresmiziara@gmail.com |

---

## 📜 Licença

Projeto com finalidade educacional.

MIT — consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

*Projeto acadêmico desenvolvido para a UNIFESO — Teresópolis, RJ.*
