document.addEventListener('DOMContentLoaded', () => {
    // Observer para animações de fade-in e slide-up ao rolar a página
    // Esta funcionalidade aplica a classe 'animate' aos elementos quando eles entram na área visível
    const observerOptions = {
        root: null, // O viewport é o elemento raiz que está sendo observado
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

    // Animação para o título de páginas internas (como Trilhas, Eventos, Biodiversidade)
    // A classe 'animated-page-title' é adicionada ao <body> para identificar essas páginas
    const pageTitleH1 = document.querySelector('.animated-page-title .page-title h1');
    if (pageTitleH1) {
        // Um pequeno atraso para que a animação ocorra após o carregamento inicial da página
        setTimeout(() => {
            pageTitleH1.classList.add('animate-title');
        }, 500); 
    }

    // Efeito Ripple para os botões. Este efeito cria um círculo que se expande ao clicar.
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function(e) {
            // Verifica se o botão clicado faz parte do formulário de login (pelo ID)
            // Se for o botão de submit do formulário de login, a lógica de login cuidará da resposta visual,
            // então não aplicamos o ripple padrão para evitar conflitos.
            if (this.closest('#adminLoginForm')) { 
                return; // Sai da função, não aplica o efeito ripple
            }

            // Remove qualquer efeito ripple anterior para garantir uma nova animação a cada clique
            const currentRipple = this.querySelector('.ripple');
            if (currentRipple) {
                currentRipple.remove();
            }

            // Cria um novo elemento <span> para o ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Calcula a posição do clique dentro do botão para posicionar o ripple
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


    // LÓGICA DE SIMULAÇÃO DE LOGIN DE ADMIN
    // Esta parte do código simula o processo de login para demonstração.
    const loginForm = document.getElementById('adminLoginForm'); // Seleciona o formulário pelo ID
    const loginMessage = document.getElementById('loginMessage'); // Seleciona a div de mensagens pelo ID

    // Verifica se o formulário de login existe na página atual
    if (loginForm) {
        // Adiciona um 'listener' para o evento de 'submit' do formulário
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // IMPEDE o envio padrão do formulário e o recarregamento da página

            // Limpa mensagens e classes de status anteriores
            loginMessage.textContent = '';
            loginMessage.className = 'login-status-message'; // Reinicia para a classe base

            // Obtém os valores dos campos de usuário e senha (para simulação, não são validados aqui)
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Simula um estado de carregamento/verificação
            loginMessage.textContent = 'Verificando credenciais...';
            loginMessage.classList.add('show', 'loading'); // Adiciona classes para mostrar e estilizar como 'loading'

            // Simula um atraso de rede ou processamento no servidor (2 segundos)
            setTimeout(() => {
                // Aqui é onde a validação real ocorreria. Para a simulação, sempre consideramos sucesso.
                // Exemplo de validação simples (descomente para testar):
                // if (username === "admin" && password === "senha123") {
                    
                    // Simula login bem-sucedido
                    loginMessage.textContent = 'Login bem-sucedido! Redirecionando...';
                    loginMessage.classList.remove('loading'); // Remove o estilo de loading
                    loginMessage.classList.add('success'); // Adiciona o estilo de sucesso

                    // Simula o redirecionamento após um pequeno atraso (1.5 segundos)
                    setTimeout(() => {
                        window.location.href = 'index.html'; // Redireciona para a página inicial
                        // Para um dashboard real, você mudaria 'index.html' para, por exemplo, 'admin-dashboard.html'
                    }, 1500); 

                // } else {
                //     // Simula login falho
                //     loginMessage.textContent = 'Usuário ou senha incorretos.';
                //     loginMessage.classList.remove('loading');
                //     loginMessage.classList.add('error'); // Adiciona o estilo de erro
                //     // Opcional: Limpa a mensagem de erro após alguns segundos
                //     setTimeout(() => {
                //         loginMessage.classList.remove('show');
                //     }, 3000);
                // }

            }, 2000); // Atraso total para a verificação inicial (2 segundos)
        });
    }
});