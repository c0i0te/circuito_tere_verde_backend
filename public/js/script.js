// Aguarda todo o HTML da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ANIMAÇÕES VISUAIS E EFEITOS (FRONTEND)
    // ==========================================

    // 1. Observer para animações de fade-in ao rolar a página
    const observerOptions = {
        root: null, // O viewport é o elemento raiz
        rootMargin: '0px', // Nenhuma margem extra
        threshold: 0.1 // O elemento se torna visível quando 10% dele está no viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Se o elemento está visível, adiciona a classe 'animate'
                entry.target.classList.add('animate');
                // Deixa de observar o elemento para que a animação aconteça apenas uma vez
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos que devem ser animados ao rolar
    document.querySelectorAll('.fade-in-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // 2. Animação para o título de páginas internas
    const pageTitleH1 = document.querySelector('.animated-page-title .page-title h1');
    if (pageTitleH1) {
        // Um pequeno atraso para que a animação ocorra após o carregamento inicial da página
        setTimeout(() => {
            pageTitleH1.classList.add('animate-title');
        }, 500); 
    }

    // 3. Efeito Ripple para os botões (.button)
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function(e) {
            // Se for o botão de submit do formulário de login, não aplicamos o ripple padrão
            // para evitar conflitos visuais com o estado de loading do formulário.
            if (this.closest('#login-form')) { 
                return;
            }

            // Remove qualquer efeito ripple anterior para garantir uma nova animação
            const currentRipple = this.querySelector('.ripple');
            if (currentRipple) {
                currentRipple.remove();
            }

            // Cria um novo elemento <span> para o ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Calcula a posição do clique dentro do botão
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Adiciona o ripple ao botão
            this.appendChild(ripple);

            // Adiciona a animação CSS para o ripple
            ripple.style.animation = 'ripple-effect 0.6s linear forwards';

            // Remove o elemento ripple do DOM quando a animação termina
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });


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
    // FORMULÁRIO DE LOGIN DE ADMIN (AUTENTICAÇÃO REAL)
    // ==========================================
    const formLogin = document.getElementById('login-form');
    const loginMessage = document.getElementById('loginMessage');

    if (formLogin) {
        formLogin.addEventListener('submit', async (evento) => {
            evento.preventDefault(); // Impede a página de recarregar

            // Limpa mensagens e classes de status anteriores
            if (loginMessage) {
                loginMessage.textContent = '';
                loginMessage.className = 'login-status-message'; 
                loginMessage.textContent = 'Verificando credenciais...';
                loginMessage.classList.add('show', 'loading');
            }

            // Pega os valores digitados usando os IDs do HTML
            const emailDigitado = document.getElementById('email').value;
            const senhaDigitada = document.getElementById('password').value;

            try {
                // Envia os dados de login para o servidor Node.js (POST)
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
                    // Sucesso! Salva a sessão e redireciona o usuário para o painel
                    sessionStorage.setItem('isAdminLoggedIn', 'true');
                    if (dados.nome) sessionStorage.setItem('adminName', dados.nome);
                    
                    if (loginMessage) {
                        loginMessage.textContent = 'Login bem-sucedido! Redirecionando...';
                        loginMessage.classList.remove('loading');
                        loginMessage.classList.add('success');
                    } else {
                        alert('Login bem-sucedido!');
                    }

                    // Redirecionamento após 1.5 segundos para o usuário ver a transição
                    setTimeout(() => {
                        window.location.href = '/admin/index.html';
                    }, 1500);
                } else {
                    // Erro retornado pela API
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
            evento.preventDefault(); // Impede a página de recarregar

            const pacoteDeDados = new FormData();
            
            // Adiciona as informações textuais do evento
            pacoteDeDados.append('titulo', document.getElementById('titulo-evento').value);
            pacoteDeDados.append('data', document.getElementById('data-evento').value);
            pacoteDeDados.append('descricao', document.getElementById('desc-evento').value);
            
            // Adiciona a imagem selecionada
            const campoImagem = document.getElementById('img-evento');
            if (campoImagem.files.length > 0) {
                pacoteDeDados.append('imagem', campoImagem.files[0]);
            }

            try {
                // Envia para o Back-end
                const respostaServidor = await fetch('/api/eventos', {
                    method: 'POST',
                    body: pacoteDeDados 
                });

                const dados = await respostaServidor.json();

                if (respostaServidor.ok) {
                    alert(dados.mensagem || 'Evento cadastrado com sucesso!');
                    formEvento.reset(); // Limpa o formulário
                } else {
                    alert(dados.erro || 'Erro ao processar o cadastro do evento.');
                }
            } catch (erro) {
                console.error('Erro de conexão:', erro);
                alert('Erro ao conectar com o servidor.');
            }
        });
    }

});