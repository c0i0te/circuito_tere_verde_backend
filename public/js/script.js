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
            // Usa caminho absoluto para evitar erros de rota
            loginButton.href = '/admin/index.html';
            
            // Adiciona o botão "Sair" ao lado
            const liElement = loginButton.parentElement;
            if (liElement && liElement.parentElement) {
                const ulElement = liElement.parentElement;
                const logoutLi = document.createElement('li');
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.textContent = 'Sair';
                logoutLink.style.color = '#ff4d4d'; // Destacar botão sair
                logoutLink.style.marginLeft = '15px';
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
            // Na página admin, acopla o evento de limpar a sessão no botão "Sair"
            loginButton.addEventListener('click', () => {
                sessionStorage.removeItem('isAdminLoggedIn');
                sessionStorage.removeItem('adminName');
            });
        }
    } else {
        // Redireciona usuários não logados que tentam acessar o painel
        if (isPageAdmin) {
            window.location.href = '/login.html';
        }
    }

    // Procura pelo formulário de login usando o ID que está no seu HTML
    const formLogin = document.getElementById('login-form');

    // Só executa o código abaixo se a pessoa estiver na página de login
    if (formLogin) {
        formLogin.addEventListener('submit', async (evento) => {
            // Impede a página de recarregar (comportamento padrão de um formulário)
            evento.preventDefault();

            // Pega os valores digitados usando os IDs do seu HTML
            const emailDigitado = document.getElementById('email').value;
            const senhaDigitada = document.getElementById('password').value;

            try {
                // O 'fetch' envia os dados de login para o servidor Node.js
                const respostaServidor = await fetch('/api/login', {
                    method: 'POST', // Método seguro para enviar dados sensíveis
                    headers: {
                        'Content-Type': 'application/json' // Avisa o servidor que é um formato JSON
                    },
                    body: JSON.stringify({ 
                        email: emailDigitado, 
                        senha: senhaDigitada 
                    })
                });

                // Transforma a resposta que volta do servidor
                const dados = await respostaServidor.json();

                // Verifica se o servidor aprovou o login (Status 200)
                if (respostaServidor.ok) {
                    // Sucesso! Salva a sessão e redireciona o usuário para o painel administrativo
                    sessionStorage.setItem('isAdminLoggedIn', 'true');
                    if (dados.nome) sessionStorage.setItem('adminName', dados.nome);
                    window.location.href = '/admin/index.html';
                } else {
                    // Erro! Mostra um alerta com a mensagem do servidor (ex: "E-mail incorreto")
                    alert(dados.erro);
                }
            } catch (erro) {
                console.error('Erro na comunicação com o servidor:', erro);
                alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
            }
        });
    }

    // ==========================================
    // LÓGICA DO PAINEL ADMINISTRATIVO (CADASTRAR EVENTO)
    // ==========================================
    const formEvento = document.getElementById('form-evento');

    if (formEvento) {
        formEvento.addEventListener('submit', async (evento) => {
            evento.preventDefault(); // Impede a página de recarregar

            // O FormData é um "pacote" especial do JS para enviar arquivos
            const pacoteDeDados = new FormData();
            
            // Adiciona os textos ao pacote
            pacoteDeDados.append('titulo', document.getElementById('titulo-evento').value);
            pacoteDeDados.append('data', document.getElementById('data-evento').value);
            pacoteDeDados.append('descricao', document.getElementById('desc-evento').value);
            
            // Adiciona o arquivo de imagem ao pacote (pega o primeiro arquivo selecionado)
            const campoImagem = document.getElementById('img-evento');
            pacoteDeDados.append('imagem', campoImagem.files[0]);

            try {
                // Envia para o Back-end
                const respostaServidor = await fetch('/api/eventos', {
                    method: 'POST',
                    body: pacoteDeDados 
                    // Nota: Quando se usa o FormData, não precisa colocar o 'headers', 
                    // o navegador faz isso automaticamente.
                });

                const dados = await respostaServidor.json();

                if (respostaServidor.ok) {
                    alert(dados.mensagem); // Mostra a mensagem do teste
                } else {
                    alert('Erro ao processar o teste.');
                }
            } catch (erro) {
                console.error('Erro de conexão:', erro);
            }
        });
    }

});