# Circuito Terê Verde Online 🌲⛰️

## 📄 Sobre o Projeto
O **Circuito Terê Verde Online** é uma plataforma digital informativa e gerenciável sobre os parques naturais, trilhas e a rica biodiversidade de Teresópolis - RJ. Desenvolvido inicialmente como um protótipo estático, o projeto agora conta com um ecossistema completo: uma interface amigável no **Front-End** conectada a um servidor robusto no **Back-End**, permitindo a gestão dinâmica de conteúdos por administradores homologados.

O objetivo principal é centralizar informações confiáveis sobre o ecoturismo local, facilitando o acesso para turistas e moradores, além de incentivar a educação ambiental de forma consciente.

---

## 🛠️ Tecnologias Utilizadas

### Front-End
* **HTML5** – Estruturação semântica das páginas.
* **CSS3** – Estilização moderna, identidade visual voltada à natureza e layout responsivo.
* **JavaScript (Vanilla JS)** – Interatividade, manipulação do DOM e integração/consumo da API assíncrona (via `fetch`).

### Back-End (O Motor do Sistema)
* **Node.js** – Ambiente de execução do JavaScript no lado do servidor.
* **Express** – Framework minimalista para gerenciamento de rotas HTTP e middlewares.
* **Multer** – Middleware para manipulação e upload de arquivos/mídias (imagens de capa).
* **JSON Storage (Persistência)** – Banco de dados em arquivos JSON locais com manipulação assíncrona de I/O, garantindo um MVP extremamente leve, rápido e de fácil portabilidade.

---

## 🏗️ Arquitetura do Sistema
O Back-End foi estruturado seguindo o padrão arquitetural **MVC (Model-View-Controller)** para garantir a separação de responsabilidades e a organização do código:

* **Model:** Responsável pela definição da estrutura dos dados e leitura/escrita nos arquivos JSON.
* **View:** Representada pelas páginas HTML e estilizações que o usuário final consome.
* **Controller:** Concentra a lógica de negócio, processando as requisições das rotas e decidindo o que deve ser salvo ou exibido.
* **Routes:** Camada que expõe os endpoints da API para o Front-End consumir.

---

## ⚙️ Funcionalidades e Regras de Negócio (RN)

### 👥 Área Pública
* Visualização dinâmica das trilhas disponíveis, níveis de dificuldade e recomendações.
* Listagem de eventos ecológicos e oficinas ambientais programadas para a região.
* Catálogo interativo da fauna e flora (biodiversidade) de Teresópolis.

### 🔐 Área Administrativa (Painel de Controle)
* **CRUD Completo:** Criação, leitura, atualização e deleção de Trilhas, Eventos e Itens de Biodiversidade.
* **Autenticação (RN01):** Sistema de login baseado em credenciais administrativas previamente cadastradas no sistema.
* **Proteção de Rotas (RN02):** Bloqueio compulsório de endpoints sensíveis. Usuários não autenticados são impedidos de acessar ou injetar dados nas páginas de administração.
* **Controle de Sessão (RN03):** Uso de `sessionStorage` no lado do cliente para validação contínua da permanência do administrador no painel.
* **Tratamento de Mídia (RN04):** Integração com o Multer para upload de imagens. Para evitar conflitos ou arquivos sobrescritos, cada mídia recebe um prefixo único baseado em *timestamp* (`Date.now()`).
* **Chaves Primárias Virtuais (RN05):** IDs autoincrementais gerados automaticamente pelo servidor a cada novo cadastro nas entidades JSON.

---

## 🚀 Como Executar o Projeto

Como o projeto agora possui um servidor ativo, siga os passos abaixo para rodar o ecossistema completo localmente:

1.  **Pré-requisitos:** Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na sua máquina.
2.  **Clonar o Repositório:**
    ```bash
    git clone https://github.com/ianMiziara/tere-verde-online.git
    cd tere-verde-online
    ```
3.  **Instalar as Dependências:**
    ```bash
    npm install
    ```
4.  **Iniciar o Servidor:**
    ```bash
    npm start
    ```
    *(Ou `node server.js`, dependendo de como configurou o seu `package.json`)*
5.  **Acessar a Plataforma:** Abra o seu navegador e acesse `http://localhost:3000` (ou a porta definida no seu arquivo de configuração).

---

## 👥 Equipe de Desenvolvimento
Projeto acadêmico desenvolvido com dedicação e muito código por:

* **Rafael Branco de Barros** – [rafaelb87@gmail.com](mailto:rafaelb87@gmail.com)
* **Carlos Rodrigo Paim de Oliveira** – [rodrigocrf.oliveira@gmail.com](mailto:rodrigocrf.oliveira@gmail.com)
* **Johann Matheus Xavier** – [johanndetere@gmail.com](mailto:johanndetere@gmail.com)
* **Ian Pires Miziara** – [ianpiresmiziara@gmail.com](mailto:ianpiresmiziara@gmail.com)

---
*Desenvolvido como projeto prático focado em desenvolvimento web e arquitetura de software.*
