// Aguarda todo o HTML da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // VERIFICAÇÃO DE SESSÃO DO ADMIN
    // ==========================================
    const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    const isPageAdmin = window.location.pathname.includes('/admin/');
    const loginButton = document.querySelector('.login-button');

    if (isAdminLoggedIn === 'true') {
        if (!isPageAdmin && loginButton) {
            // Nas páginas públicas, altera o botão "Admin" para "Painel Admin"
            loginButton.textContent = 'Painel Admin';
            loginButton.href = '/admin/index.html';
            
            // Adiciona o botão "Sair" ao lado no menu de navegação
            const liElement = loginButton.parentElement;
            if (liElement && liElement.parentElement) {
                const ulElement = liElement.parentElement;
                const logoutLi = document.createElement('li');
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.textContent = 'Sair';
                logoutLink.style.color = '#ff4d4d'; // Destacar botão sair
                logoutLink.style.marginLeft = '15px';
                logoutLink.style.fontWeight = '600';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    sessionStorage.removeItem('isAdminLoggedIn');
                    sessionStorage.removeItem('adminName');
                    window.location.href = '/index.html'; 
                });
                logoutLi.appendChild(logoutLink);
                ulElement.appendChild(logoutLi);
            }
        } else if (isPageAdmin && loginButton) {
            // Na página admin, limpa a sessão no botão "Sair" do menu
            loginButton.addEventListener('click', () => {
                sessionStorage.removeItem('isAdminLoggedIn');
                sessionStorage.removeItem('adminName');
            });
        }
    } else {
        // Redireciona usuários não logados que tentam acessar o painel de administração
        if (isPageAdmin) {
            window.location.href = '/login.html';
        }
    }

    // ==========================================
    // ANIMAÇÕES VISUAIS E EFEITOS (FRONTEND)
    // ==========================================

    // 1. Observer para animações de fade-in ao rolar a página
    const observerOptions = {
        root: null, 
        rootMargin: '0px', 
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos que devem ser animados ao rolar
    function ativarAnimacoesScroll() {
        document.querySelectorAll('.fade-in-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }
    ativarAnimacoesScroll();

    // 2. Animação para o título de páginas internas
    const pageTitleH1 = document.querySelector('.animated-page-title .page-title h1');
    if (pageTitleH1) {
        setTimeout(() => {
            pageTitleH1.classList.add('animate-title');
        }, 500); 
    }

    // 3. Efeito Ripple para os botões (.button)
    function ativarEfeitoRipple() {
        document.querySelectorAll('.button').forEach(button => {
            // Evita duplicar listeners
            if (button.dataset.rippleAttached) return;
            button.dataset.rippleAttached = "true";

            button.addEventListener('click', function(e) {
                if (this.closest('#login-form')) { 
                    return;
                }

                const currentRipple = this.querySelector('.ripple');
                if (currentRipple) {
                    currentRipple.remove();
                }

                const ripple = document.createElement('span');
                ripple.classList.add('ripple');

                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                this.appendChild(ripple);
                ripple.style.animation = 'ripple-effect 0.6s linear forwards';

                ripple.addEventListener('animationend', () => {
                    ripple.remove();
                });
            });
        });
    }
    ativarEfeitoRipple();


    // ==========================================
    // CARREGAMENTO DINÂMICO DE CONTEÚDO NAS PÁGINAS PÚBLICAS
    // ==========================================

    let eventosCache = [];
    let trilhasCache = [];
    let bioCache = [];

    // 1. Carregar Eventos
    const listEventosPub = document.getElementById('eventos-lista-publica');
    if (listEventosPub) {
        carregarEventosPublicos();
    }

    async function carregarEventosPublicos() {
        try {
            const resposta = await fetch('/api/eventos');
            if (resposta.ok) {
                eventosCache = await resposta.json();
                if (eventosCache.length === 0) {
                    listEventosPub.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum evento cadastrado no momento.</p>';
                    return;
                }

                let html = '';
                eventosCache.forEach(evt => {
                    const partesData = evt.data.trim().split(' ');
                    const mes = partesData[0] || 'JUL';
                    const dia = partesData[1] || '20';
                    const imgSrc = evt.imagem ? (evt.imagem.startsWith('http') ? evt.imagem : `/images/${evt.imagem}`) : '/images/evento-aves.jpg';

                    html += `
                        <div class="event-card fade-in-on-scroll">
                            <div class="event-image">
                                <img class="ajuste-topo" src="${imgSrc}" alt="${evt.titulo}">
                            </div>
                            <div class="event-details">
                                <div class="event-date-column">
                                    <div class="event-date">
                                        <span>${mes}</span>
                                        <strong>${dia}</strong>
                                    </div>
                                    <p class="event-time">Horário: 14:00</p>
                                </div>
                                <div class="event-info">
                                    <h3>${evt.titulo}</h3>
                                    <p>${evt.descricao}</p>
                                    <a href="#" class="button btn-inscricao-trigger" data-evento="${evt.titulo}">Inscreva-se</a>
                                    
                                    ${isAdminLoggedIn === 'true' ? `
                                    <div class="admin-actions-container">
                                        <button class="btn-admin-edit" data-id="${evt.id}" data-type="evento">Editar</button>
                                        <button class="btn-admin-delete" data-id="${evt.id}" data-type="evento">Excluir</button>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                });

                listEventosPub.innerHTML = html;
                vincularBotoesInscricaoDinamicos();
                ativarAnimacoesScroll();
                ativarEfeitoRipple();

                if (isAdminLoggedIn === 'true') {
                    vincularBotoesAdminDinamicos(listEventosPub);
                }
            } else {
                listEventosPub.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Erro ao carregar os eventos.</p>';
            }
        } catch (erro) {
            console.error('Erro ao buscar eventos:', erro);
            listEventosPub.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Erro ao conectar com o servidor.</p>';
        }
    }

    // 2. Carregar Trilhas
    const listTrilhasPub = document.getElementById('trilhas-lista-publica');
    if (listTrilhasPub) {
        carregarTrilhasPublicas();
    }

    async function carregarTrilhasPublicas() {
        try {
            const resposta = await fetch('/api/trilhas');
            if (resposta.ok) {
                trilhasCache = await resposta.json();
                if (trilhasCache.length === 0) {
                    listTrilhasPub.innerHTML = '<p style="text-align: center; width: 100%;">Nenhuma trilha cadastrada no momento.</p>';
                    return;
                }

                let html = '';
                trilhasCache.forEach(trilha => {
                    const imgSrc = trilha.imagem ? (trilha.imagem.startsWith('http') ? trilha.imagem : `/images/${trilha.imagem}`) : '/images/trilha-pedra-do-sino.jpg';

                    html += `
                        <div class="content-item fade-in-on-scroll">
                            <div class="content-image">
                                <img src="${imgSrc}" alt="${trilha.nome}">
                            </div>
                            <div class="content-text">
                                <h3>${trilha.nome}</h3>
                                <p><strong>Dificuldade:</strong> ${trilha.dificuldade || 'Média'}</p>
                                <p>${trilha.descricao}</p>
                                <a href="#" class="button">Saiba Mais</a>

                                ${isAdminLoggedIn === 'true' ? `
                                <div class="admin-actions-container">
                                    <button class="btn-admin-edit" data-id="${trilha.id}" data-type="trilha">Editar</button>
                                    <button class="btn-admin-delete" data-id="${trilha.id}" data-type="trilha">Excluir</button>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                });

                listTrilhasPub.innerHTML = html;
                ativarAnimacoesScroll();
                ativarEfeitoRipple();

                if (isAdminLoggedIn === 'true') {
                    vincularBotoesAdminDinamicos(listTrilhasPub);
                }
            } else {
                listTrilhasPub.innerHTML = '<p style="text-align: center; color: red;">Erro ao carregar as trilhas.</p>';
            }
        } catch (erro) {
            console.error('Erro ao buscar trilhas:', erro);
            listTrilhasPub.innerHTML = '<p style="text-align: center; color: red;">Erro ao conectar com o servidor.</p>';
        }
    }

    // 3. Carregar Biodiversidade
    const listFaunaPub = document.getElementById('fauna-lista-publica');
    const listFloraPub = document.getElementById('flora-lista-publica');
    if (listFaunaPub || listFloraPub) {
        carregarBiodiversidadePublica();
    }

    async function carregarBiodiversidadePublica() {
        try {
            const resposta = await fetch('/api/biodiversidade');
            if (resposta.ok) {
                bioCache = await resposta.json();
                
                const faunaItens = bioCache.filter(item => item.categoria.toLowerCase() === 'fauna');
                const floraItens = bioCache.filter(item => item.categoria.toLowerCase() === 'flora');

                // Fauna
                if (listFaunaPub) {
                    if (faunaItens.length === 0) {
                        listFaunaPub.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum animal cadastrado no momento.</p>';
                    } else {
                        let html = '';
                        faunaItens.forEach(item => {
                            const imgSrc = item.imagem ? (item.imagem.startsWith('http') ? item.imagem : `/images/${item.imagem}`) : '/images/fauna-mico.jpg';
                            html += `
                                <div class="gallery-card fade-in-on-scroll">
                                    <img src="${imgSrc}" alt="${item.especie || item.nome}">
                                    <div class="gallery-card-text">
                                        <h3>${item.especie || item.nome}</h3>
                                        <p>${item.descricao}</p>
                                        
                                        ${isAdminLoggedIn === 'true' ? `
                                        <div class="admin-actions-container">
                                            <button class="btn-admin-edit" data-id="${item.id}" data-type="biodiversidade">Editar</button>
                                            <button class="btn-admin-delete" data-id="${item.id}" data-type="biodiversidade">Excluir</button>
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        });
                        listFaunaPub.innerHTML = html;
                        ativarAnimacoesScroll();
                        ativarEfeitoRipple();
                        if (isAdminLoggedIn === 'true') {
                            vincularBotoesAdminDinamicos(listFaunaPub);
                        }
                    }
                }

                // Flora
                if (listFloraPub) {
                    if (floraItens.length === 0) {
                        listFloraPub.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhuma planta cadastrada no momento.</p>';
                    } else {
                        let html = '';
                        floraItens.forEach(item => {
                            const imgSrc = item.imagem ? (item.imagem.startsWith('http') ? item.imagem : `/images/${item.imagem}`) : '/images/flora-orquidea.jpg';
                            html += `
                                <div class="gallery-card fade-in-on-scroll">
                                    <img src="${imgSrc}" alt="${item.especie || item.nome}">
                                    <div class="gallery-card-text">
                                        <h3>${item.especie || item.nome}</h3>
                                        <p>${item.descricao}</p>
                                        
                                        ${isAdminLoggedIn === 'true' ? `
                                        <div class="admin-actions-container">
                                            <button class="btn-admin-edit" data-id="${item.id}" data-type="biodiversidade">Editar</button>
                                            <button class="btn-admin-delete" data-id="${item.id}" data-type="biodiversidade">Excluir</button>
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        });
                        listFloraPub.innerHTML = html;
                        ativarAnimacoesScroll();
                        ativarEfeitoRipple();
                        if (isAdminLoggedIn === 'true') {
                            vincularBotoesAdminDinamicos(listFloraPub);
                        }
                    }
                }
            } else {
                if (listFaunaPub) listFaunaPub.innerHTML = '<p style="color: red;">Erro ao carregar fauna.</p>';
                if (listFloraPub) listFloraPub.innerHTML = '<p style="color: red;">Erro ao carregar flora.</p>';
            }
        } catch (erro) {
            console.error('Erro ao buscar biodiversidade:', erro);
            if (listFaunaPub) listFaunaPub.innerHTML = '<p style="color: red;">Erro ao se conectar.</p>';
            if (listFloraPub) listFloraPub.innerHTML = '<p style="color: red;">Erro ao se conectar.</p>';
        }
    }


    // ==========================================
    // CONTROLES DE EDICAO E EXCLUSAO DO ADMINISTRADOR
    // ==========================================

    function vincularBotoesAdminDinamicos(container) {
        // Exclusão
        container.querySelectorAll('.btn-admin-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                const tipo = btn.getAttribute('data-type');
                confirmarExclusao(tipo, id);
            });
        });

        // Edição
        container.querySelectorAll('.btn-admin-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                const tipo = btn.getAttribute('data-type');
                prepararEdicao(tipo, id);
            });
        });
    }

    async function confirmarExclusao(tipo, id) {
        if (!confirm(`Deseja realmente excluir este ${tipo}?`)) {
            return;
        }

        let url = '';
        if (tipo === 'evento') url = `/api/eventos/${id}`;
        else if (tipo === 'trilha') url = `/api/trilhas/${id}`;
        else if (tipo === 'biodiversidade') url = `/api/biodiversidade/${id}`;

        try {
            const resposta = await fetch(url, {
                method: 'DELETE'
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.mensagem || 'Excluído com sucesso!');
                if (tipo === 'evento') carregarEventosPublicos();
                else if (tipo === 'trilha') carregarTrilhasPublicas();
                else if (tipo === 'biodiversidade') carregarBiodiversidadePublica();
            } else {
                alert(resultado.erro || 'Erro ao tentar excluir item.');
            }
        } catch (erro) {
            console.error('Erro de conexão ao excluir:', erro);
            alert('Erro ao se conectar com o servidor.');
        }
    }

    // Modais de Edição
    const modalEditEvento = document.getElementById('edicao-evento-modal');
    const modalEditTrilha = document.getElementById('edicao-trilha-modal');
    const modalEditBio = document.getElementById('edicao-bio-modal');

    // Fechar modais ao clicar no X
    document.querySelectorAll('.modal .close-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal && modal.id.startsWith('edicao-')) {
                fecharModalEdicao(modal);
            }
        });
    });

    function fecharModalEdicao(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            const status = modal.querySelector('.login-status-message');
            if (status) {
                status.textContent = '';
                status.className = 'login-status-message';
            }
        }, 300);
    }

    function prepararEdicao(tipo, id) {
        if (tipo === 'evento') {
            const evento = eventosCache.find(e => e.id == id);
            if (evento && modalEditEvento) {
                document.getElementById('edit-evento-id').value = evento.id;
                document.getElementById('edit-evento-titulo').value = evento.titulo;
                document.getElementById('edit-evento-data').value = evento.data;
                document.getElementById('edit-evento-desc').value = evento.descricao;
                
                modalEditEvento.style.display = 'flex';
                setTimeout(() => modalEditEvento.classList.add('show'), 10);
            }
        } else if (tipo === 'trilha') {
            const trilha = trilhasCache.find(t => t.id == id);
            if (trilha && modalEditTrilha) {
                document.getElementById('edit-trilha-id').value = trilha.id;
                document.getElementById('edit-trilha-nome').value = trilha.nome;
                document.getElementById('edit-trilha-dif').value = trilha.dificuldade;
                document.getElementById('edit-trilha-desc').value = trilha.descricao;

                modalEditTrilha.style.display = 'flex';
                setTimeout(() => modalEditTrilha.classList.add('show'), 10);
            }
        } else if (tipo === 'biodiversidade') {
            const bio = bioCache.find(b => b.id == id);
            if (bio && modalEditBio) {
                document.getElementById('edit-bio-id').value = bio.id;
                document.getElementById('edit-bio-tipo').value = bio.categoria;
                document.getElementById('edit-bio-nome').value = bio.especie || bio.nome;
                document.getElementById('edit-bio-desc').value = bio.descricao;

                modalEditBio.style.display = 'flex';
                setTimeout(() => modalEditBio.classList.add('show'), 10);
            }
        }
    }

    // Submit dos formulários de edição (PUT)
    const formEditEvento = document.getElementById('form-editar-evento');
    if (formEditEvento) {
        formEditEvento.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-evento-id').value;
            const status = document.getElementById('edit-evento-status');

            status.textContent = 'Salvando alterações...';
            status.className = 'login-status-message show loading';

            const payload = new FormData();
            payload.append('titulo', document.getElementById('edit-evento-titulo').value);
            payload.append('data', document.getElementById('edit-evento-data').value);
            payload.append('descricao', document.getElementById('edit-evento-desc').value);
            
            const fileInput = document.getElementById('edit-evento-img');
            if (fileInput.files.length > 0) {
                payload.append('imagem', fileInput.files[0]);
            }

            try {
                const resposta = await fetch(`/api/eventos/${id}`, {
                    method: 'PUT',
                    body: payload
                });
                const resultado = await resposta.json();

                if (resposta.ok) {
                    status.textContent = 'Evento atualizado com sucesso!';
                    status.className = 'login-status-message show success';
                    setTimeout(() => {
                        fecharModalEdicao(modalEditEvento);
                        carregarEventosPublicos();
                    }, 1500);
                } else {
                    status.textContent = resultado.erro || 'Erro ao salvar alterações.';
                    status.className = 'login-status-message show error';
                }
            } catch (erro) {
                console.error(erro);
                status.textContent = 'Erro de rede ao salvar.';
                status.className = 'login-status-message show error';
            }
        });
    }

    const formEditTrilha = document.getElementById('form-editar-trilha');
    if (formEditTrilha) {
        formEditTrilha.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-trilha-id').value;
            const status = document.getElementById('edit-trilha-status');

            status.textContent = 'Salvando alterações...';
            status.className = 'login-status-message show loading';

            const payload = new FormData();
            payload.append('nome', document.getElementById('edit-trilha-nome').value);
            payload.append('dificuldade', document.getElementById('edit-trilha-dif').value);
            payload.append('descricao', document.getElementById('edit-trilha-desc').value);
            
            const fileInput = document.getElementById('edit-trilha-img');
            if (fileInput.files.length > 0) {
                payload.append('imagem', fileInput.files[0]);
            }

            try {
                const resposta = await fetch(`/api/trilhas/${id}`, {
                    method: 'PUT',
                    body: payload
                });
                const resultado = await resposta.json();

                if (resposta.ok) {
                    status.textContent = 'Trilha atualizada com sucesso!';
                    status.className = 'login-status-message show success';
                    setTimeout(() => {
                        fecharModalEdicao(modalEditTrilha);
                        carregarTrilhasPublicas();
                    }, 1500);
                } else {
                    status.textContent = resultado.erro || 'Erro ao salvar.';
                    status.className = 'login-status-message show error';
                }
            } catch (erro) {
                console.error(erro);
                status.textContent = 'Erro de rede ao salvar.';
                status.className = 'login-status-message show error';
            }
        });
    }

    const formEditBio = document.getElementById('form-editar-bio');
    if (formEditBio) {
        formEditBio.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-bio-id').value;
            const status = document.getElementById('edit-bio-status');

            status.textContent = 'Salvando alterações...';
            status.className = 'login-status-message show loading';

            const payload = new FormData();
            payload.append('categoria', document.getElementById('edit-bio-tipo').value);
            payload.append('especie', document.getElementById('edit-bio-nome').value);
            payload.append('descricao', document.getElementById('edit-bio-desc').value);
            
            const fileInput = document.getElementById('edit-bio-img');
            if (fileInput.files.length > 0) {
                payload.append('imagem', fileInput.files[0]);
            }

            try {
                const resposta = await fetch(`/api/biodiversidade/${id}`, {
                    method: 'PUT',
                    body: payload
                });
                const resultado = await resposta.json();

                if (resposta.ok) {
                    status.textContent = 'Biodiversidade atualizada com sucesso!';
                    status.className = 'login-status-message show success';
                    setTimeout(() => {
                        fecharModalEdicao(modalEditBio);
                        carregarBiodiversidadePublica();
                    }, 1500);
                } else {
                    status.textContent = resultado.erro || 'Erro ao salvar.';
                    status.className = 'login-status-message show error';
                }
            } catch (erro) {
                console.error(erro);
                status.textContent = 'Erro de rede ao salvar.';
                status.className = 'login-status-message show error';
            }
        });
    }


    // ==========================================
    // FORMULÁRIO DE LOGIN DE ADMIN (AUTENTICAÇÃO REAL)
    // ==========================================
    const formLogin = document.getElementById('login-form');
    const loginMessage = document.getElementById('loginMessage');

    if (formLogin) {
        formLogin.addEventListener('submit', async (evento) => {
            evento.preventDefault(); 

            if (loginMessage) {
                loginMessage.textContent = '';
                loginMessage.className = 'login-status-message'; 
                loginMessage.textContent = 'Verificando credenciais...';
                loginMessage.classList.add('show', 'loading');
            }

            const emailDigitado = document.getElementById('email').value;
            const senhaDigitada = document.getElementById('password').value;

            try {
                const respostaServidor = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        email: emailDigitado, 
                        senha: senhaDigitada 
                    })
                });

                const dados = await respostaServidor.json();

                if (respostaServidor.ok) {
                    sessionStorage.setItem('isAdminLoggedIn', 'true');
                    if (dados.nome) sessionStorage.setItem('adminName', dados.nome);
                    
                    if (loginMessage) {
                        loginMessage.textContent = 'Login bem-sucedido! Redirecionando...';
                        loginMessage.classList.remove('loading');
                        loginMessage.classList.add('success');
                    }

                    setTimeout(() => {
                        window.location.href = '/admin/index.html';
                    }, 1500);
                } else {
                    if (loginMessage) {
                        loginMessage.textContent = dados.erro || 'E-mail ou senha incorretos!';
                        loginMessage.classList.remove('loading');
                        loginMessage.classList.add('error');
                    } else {
                        alert(dados.erro);
                    }
                }
            } catch (erro) {
                console.error('Erro na comunicação com o servidor:', erro);
                if (loginMessage) {
                    loginMessage.textContent = 'Erro ao se comunicar com o servidor. Tente novamente.';
                    loginMessage.classList.remove('loading');
                    loginMessage.classList.add('error');
                } else {
                    alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
                }
            }
        });
    }


    // ==========================================
    // CADASTRAR NOVO EVENTO (PAINEL ADMINISTRATIVO)
    // ==========================================
    const formEvento = document.getElementById('form-evento');

    if (formEvento) {
        formEvento.addEventListener('submit', async (evento) => {
            evento.preventDefault(); 

            const pacoteDeDados = new FormData();
            pacoteDeDados.append('titulo', document.getElementById('titulo-evento').value);
            pacoteDeDados.append('data', document.getElementById('data-evento').value);
            pacoteDeDados.append('descricao', document.getElementById('desc-evento').value);
            
            const campoImagem = document.getElementById('img-evento');
            if (campoImagem.files.length > 0) {
                pacoteDeDados.append('imagem', campoImagem.files[0]);
            }

            try {
                const respostaServidor = await fetch('/api/eventos', {
                    method: 'POST',
                    body: pacoteDeDados 
                });

                const dados = await respostaServidor.json();

                if (respostaServidor.ok) {
                    alert(dados.mensagem || 'Evento cadastrado com sucesso!');
                    formEvento.reset(); 
                } else {
                    alert(dados.erro || 'Erro ao processar o cadastro do evento.');
                }
            } catch (erro) {
                console.error('Erro de conexão:', erro);
                alert('Erro ao conectar com o servidor.');
            }
        });
    }

    // ==========================================
    // CADASTRAR NOVA TRILHA (PAINEL ADMINISTRATIVO)
    // ==========================================
    const formTrilha = document.getElementById('form-trilha');

    if (formTrilha) {
        formTrilha.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            const pacoteDeDados = new FormData();
            pacoteDeDados.append('nome', document.getElementById('nome-trilha').value);
            pacoteDeDados.append('dificuldade', document.getElementById('dif-trilha').value);
            pacoteDeDados.append('descricao', document.getElementById('desc-trilha').value);
            
            const campoImagem = document.getElementById('img-trilha');
            if (campoImagem.files.length > 0) {
                pacoteDeDados.append('imagem', campoImagem.files[0]);
            }

            try {
                const respostaServidor = await fetch('/api/trilhas', {
                    method: 'POST',
                    body: pacoteDeDados
                });

                const dados = await respostaServidor.json();

                if (respostaServidor.ok) {
                    alert(dados.mensagem || 'Trilha cadastrada com sucesso!');
                    formTrilha.reset();
                } else {
                    alert(dados.erro || 'Erro ao cadastrar trilha.');
                }
            } catch (erro) {
                console.error('Erro de conexão:', erro);
                alert('Erro ao conectar com o servidor.');
            }
        });
    }

    // ==========================================
    // CADASTRAR BIODIVERSIDADE (PAINEL ADMINISTRATIVO)
    // ==========================================
    const formBio = document.getElementById('form-biodiversidade');

    if (formBio) {
        formBio.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            const pacoteDeDados = new FormData();
            pacoteDeDados.append('categoria', document.getElementById('tipo-bio').value);
            pacoteDeDados.append('especie', document.getElementById('nome-bio').value);
            pacoteDeDados.append('descricao', document.getElementById('desc-bio').value);
            
            const campoImagem = document.getElementById('img-bio');
            if (campoImagem.files.length > 0) {
                pacoteDeDados.append('imagem', campoImagem.files[0]);
            }

            try {
                const respostaServidor = await fetch('/api/biodiversidade', {
                    method: 'POST',
                    body: pacoteDeDados
                });

                const dados = await respostaServidor.json();

                if (respostaServidor.ok) {
                    alert(dados.mensagem || 'Biodiversidade cadastrada com sucesso!');
                    formBio.reset();
                } else {
                    alert(dados.erro || 'Erro ao cadastrar biodiversidade.');
                }
            } catch (erro) {
                console.error('Erro de conexão:', erro);
                alert('Erro ao conectar com o servidor.');
            }
        });
    }


    // ==========================================
    // LÓGICA DO MODAL DE INSCRIÇÃO EM EVENTOS
    // ==========================================
    const modalInscricao = document.getElementById('inscricao-modal');
    const modalNomeEvento = document.getElementById('evento-selecionado-nome');
    const inputEventoTitulo = document.getElementById('evento-titulo');
    const closeBtnInscricao = document.querySelector('#inscricao-modal .close-button');
    const formInscricao = document.getElementById('form-inscricao');
    const statusInscricao = document.getElementById('inscricao-status');

    function vincularBotoesInscricaoDinamicos() {
        document.querySelectorAll('.btn-inscricao-trigger').forEach(botao => {
            botao.addEventListener('click', (e) => {
                e.preventDefault();
                const nomeEvento = botao.getAttribute('data-evento');
                abrirModal(nomeEvento);
            });
        });
    }

    function abrirModal(nomeEvento) {
        if (modalInscricao) {
            modalNomeEvento.textContent = nomeEvento;
            inputEventoTitulo.value = nomeEvento;
            modalInscricao.style.display = 'flex';
            setTimeout(() => {
                modalInscricao.classList.add('show');
            }, 10);
        }
    }

    function fecharModal() {
        if (modalInscricao) {
            modalInscricao.classList.remove('show');
            setTimeout(() => {
                modalInscricao.style.display = 'none';
                if (formInscricao) formInscricao.reset();
                if (statusInscricao) {
                    statusInscricao.textContent = '';
                    statusInscricao.className = 'login-status-message';
                }
            }, 300);
        }
    }

    if (closeBtnInscricao) {
        closeBtnInscricao.addEventListener('click', fecharModal);
    }

    if (modalInscricao) {
        modalInscricao.addEventListener('click', (e) => {
            if (e.target === modalInscricao) {
                fecharModal();
            }
        });
    }

    // Submissão do formulário de inscrição
    if (formInscricao) {
        formInscricao.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (statusInscricao) {
                statusInscricao.textContent = 'Enviando sua inscrição...';
                statusInscricao.className = 'login-status-message show loading';
            }

            const dados = {
                evento: inputEventoTitulo.value,
                nome: document.getElementById('inscrito-nome').value,
                email: document.getElementById('inscrito-email').value,
                telefone: document.getElementById('inscrito-telefone').value,
                idade: document.getElementById('inscrito-idade').value,
                endereco: document.getElementById('inscrito-endereco').value
            };

            try {
                const resposta = await fetch('/api/inscricoes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                });

                const resultado = await resposta.json();

                if (resposta.ok) {
                    if (statusInscricao) {
                        statusInscricao.textContent = 'Inscrição realizada com sucesso!';
                        statusInscricao.className = 'login-status-message show success';
                    }
                    
                    setTimeout(() => {
                        fecharModal();
                    }, 2000);
                } else {
                    if (statusInscricao) {
                        statusInscricao.textContent = resultado.erro || 'Erro ao realizar inscrição.';
                        statusInscricao.className = 'login-status-message show error';
                    }
                }
            } catch (erro) {
                console.error('Erro de conexão ao enviar inscrição:', erro);
                if (statusInscricao) {
                    statusInscricao.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
                    statusInscricao.className = 'login-status-message show error';
                }
            }
        });
    }


    // ==========================================
    // CARREGAR LISTA DE INSCRIÇÕES NO PAINEL ADMIN
    // ==========================================
    const containerInscricoes = document.getElementById('inscricoes-lista-container');
    
    if (isPageAdmin && containerInscricoes) {
        carregarInscricoesAdmin();
    }

    async function carregarInscricoesAdmin() {
        try {
            const resposta = await fetch('/api/inscricoes');
            if (resposta.ok) {
                const inscricoes = await resposta.json();
                
                if (inscricoes.length === 0) {
                    containerInscricoes.innerHTML = '<p>Nenhuma inscrição realizada até o momento.</p>';
                    return;
                }
                
                let html = `
                    <div class="table-responsive">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Evento</th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Telefone</th>
                                    <th>Idade</th>
                                    <th>Endereço</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                inscricoes.forEach(ins => {
                    html += `
                        <tr>
                            <td>${ins.id}</td>
                            <td><strong>${ins.evento}</strong></td>
                            <td>${ins.nome}</td>
                            <td>${ins.email}</td>
                            <td>${ins.telefone}</td>
                            <td>${ins.idade} anos</td>
                            <td>${ins.endereco}</td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
                containerInscricoes.innerHTML = html;
            } else {
                containerInscricoes.innerHTML = '<p style="color: red;">Erro ao carregar lista de inscrições do servidor.</p>';
            }
        } catch (erro) {
            console.error('Erro ao buscar inscrições:', erro);
            containerInscricoes.innerHTML = '<p style="color: red;">Erro de conexão com o servidor.</p>';
        }
    }

});