// Variáveis globais para armazenar dados simulados
let users = JSON.parse(localStorage.getItem('users')) || [];
let publications = JSON.parse(localStorage.getItem('publications')) || [];
let loggedInUserEmail = localStorage.getItem('loggedInUserEmail') || null;

// --- UTILS (Funções Auxiliares) ---

// Função para exibir mensagens de erro/sucesso
function showMessage(elementId, message, isError = false) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.color = isError ? '#e57373' : '#a5d6a7'; // Cores pastel para erro/sucesso
        messageElement.style.display = 'block';
        setTimeout(() => {
            messageElement.style.display = 'none';
            messageElement.textContent = '';
        }, 5000); // Esconde a mensagem após 5 segundos
    }
}

// Função para formatar a data de publicação
function formatPostDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// --- PROTEÇÃO DE ROTAS E GERENCIAMENTO DE ESTADO DE LOGIN ---

// Verifica se o usuário está logado e redireciona se necessário
function protectPage() {
    // A função 'protegerPagina' é chamada diretamente no HTML antes do defer
    // por isso precisa ser uma função global imediatamente disponível.
    // Garantimos que 'loggedInUserEmail' seja atualizado na inicialização do script.
    const isUserLoggedIn = localStorage.getItem('loggedInUserEmail') !== null;
    if (!isUserLoggedIn && (window.location.pathname.includes('painel-usuario.html') || window.location.pathname.includes('nova-publicacao.html') || window.location.pathname.includes('configuracoes.html'))) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
    }
}

// Atualiza o estado da UI da navegação (links visíveis/invisíveis, texto do botão de login/sair)
function updateNavUI() {
    const isUserLoggedIn = loggedInUserEmail !== null;
    const navLinks = document.getElementById('navLinks');
    const authLink = document.getElementById('authLink');

    if (navLinks) {
        // Oculta/mostra links baseados no status de login
        navLinks.querySelectorAll('.logged-in-only').forEach(item => {
            item.style.display = isUserLoggedIn ? 'list-item' : 'none';
        });
    }

    if (authLink) {
        authLink.textContent = isUserLoggedIn ? 'Sair' : 'Entrar/Cadastrar';
        authLink.href = isUserLoggedIn ? '#' : 'login.html'; // Para 'Sair', trataremos o clique no JS
    }
}

// Gerencia o clique no botão "Sair"
function handleAuthLinkClick(event) {
    if (loggedInUserEmail !== null) { // Se o usuário está logado e clicou em "Sair"
        event.preventDefault(); // Previne o redirecionamento padrão
        const confirmLogout = confirm('Tem certeza que deseja sair?');
        if (confirmLogout) {
            localStorage.removeItem('loggedInUserEmail');
            loggedInUserEmail = null;
            alert('Você foi desconectado.');
            window.location.href = 'index.html'; // Redireciona para a página inicial
        }
    }
    // Se não estiver logado, o link já aponta para login.html, então não faz nada
}


// --- LÓGICA DE AUTENTICAÇÃO ---

// Login
function acionarBotao() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageElementId = 'errorMessage';

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!email || !password) {
        showMessage(errorMessageElementId, 'Preencha todos os campos!', true);
        return;
    }

    // Credenciais de teste da documentação
    const TEST_EMAIL = 'admin@admin';
    const TEST_PASSWORD = 'admin';

    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        localStorage.setItem('loggedInUserEmail', email);
        loggedInUserEmail = email; // Atualiza a variável global
        showMessage(errorMessageElementId, 'Login realizado com sucesso!', false);
        setTimeout(() => {
            window.location.href = 'painel-usuario.html';
        }, 1000);
    } else {
        showMessage(errorMessageElementId, 'Email ou senha incorretos. Tente novamente.', true);
    }
}

// Cadastro
function acionarCadastro() {
    const nameInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('senha');
    const confirmPasswordInput = document.getElementById('confirmaSenha');
    const termsCheckbox = document.getElementById('termos');
    const errorMessageElementId = 'errorMessage';

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';
    const termsAccepted = termsCheckbox ? termsCheckbox.checked : false;

    if (!name || !email || !password || !confirmPassword) {
        showMessage(errorMessageElementId, 'Preencha todos os campos!', true);
        return;
    }
    if (password !== confirmPassword) {
        showMessage(errorMessageElementId, 'As senhas não coincidem!', true);
        return;
    }
    if (!termsAccepted) {
        showMessage(errorMessageElementId, 'Você precisa aceitar os termos de uso e política de privacidade!', true);
        return;
    }

    // Credenciais de teste da documentação para cadastro
    const TEST_NAME = 'Admin';
    const TEST_EMAIL_CADASTRO = 'admin@admin'; // Apenas para simular o cadastro do admin
    const TEST_PASSWORD_CADASTRO = 'admin';

    // Simulação: se os dados forem iguais aos de teste, aceita o cadastro.
    // Em um cenário real, você adicionaria o novo usuário ao array 'users' e salvaria.
    if (name === TEST_NAME && email === TEST_EMAIL_CADASTRO && password === TEST_PASSWORD_CADASTRO) {
        // Em uma aplicação real, você adicionaria o usuário ao array `users` e salvaria no localStorage
        // users.push({ name, email, password }); // (Senha não deve ser salva em texto puro em prod!)
        // localStorage.setItem('users', JSON.stringify(users));
        showMessage(errorMessageElementId, 'Cadastro realizado com sucesso!', false);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    } else {
        // Simulação: para qualquer outro dado, simplesmente aceita como um cadastro de sucesso
        showMessage(errorMessageElementId, 'Cadastro realizado com sucesso! Você pode usar qualquer e-mail/senha para teste.', false);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Recuperação de Senha
function acionarRecuperacaoSenha() {
    const emailInput = document.getElementById('email');
    const errorMessageElementId = 'errorMessage';

    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
        showMessage(errorMessageElementId, 'Preencha o campo de email!', true);
        return;
    }

    // Credenciais de teste da documentação para recuperação
    const TEST_EMAIL_RECOVERY = 'admin@admin';

    if (email === TEST_EMAIL_RECOVERY) {
        showMessage(errorMessageElementId, 'Se o e-mail estiver cadastrado, um link de redefinição foi enviado!', false);
        // Em um cenário real, aqui haveria uma lógica de envio de e-mail.
    } else {
        // Para simplificar, sempre exibe a mensagem de sucesso para não revelar se o e-mail existe
        showMessage(errorMessageElementId, 'Se o e-mail estiver cadastrado, um link de redefinição foi enviado!', false);
    }
}


// --- LÓGICA DE PUBLICAÇÕES ---

// Criar Publicação
function criarPublicacao() {
    const titleInput = document.getElementById('titulo');
    const contentInput = document.getElementById('conteudo');
    const categorySelect = document.getElementById('categoria');
    const tagsInput = document.getElementById('tags');

    const title = titleInput ? titleInput.value.trim() : '';
    const content = contentInput ? contentInput.value.trim() : '';
    const category = categorySelect ? categorySelect.value : 'Outros';
    const tags = tagsInput ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];

    if (!title || !content) {
        alert('Por favor, preencha o título e o conteúdo da publicação.');
        return;
    }

    const newPublication = {
        id: Date.now(), // ID único baseado no timestamp
        title,
        content,
        authorEmail: loggedInUserEmail, // O e-mail do autor logado
        authorName: loggedInUserEmail ? loggedInUserEmail.split('@')[0] : 'Anônimo', // Nome simples do autor
        date: new Date().toISOString(), // Data em formato ISO
        category,
        tags,
        comments: [] // Array para armazenar comentários
    };

    publications.push(newPublication);
    localStorage.setItem('publications', JSON.stringify(publications));
    alert('Publicação criada com sucesso!');
    window.location.href = 'painel-usuario.html';
}

// Listar Publicações (usado no Painel, Comunidade, Index, Blog)
function listPublications(targetElementId, filterByAuthor = false, limit = null) {
    const listElement = document.getElementById(targetElementId);
    if (!listElement) return;

    let postsToShow = publications;

    // Filtra por autor se for o painel do usuário
    if (filterByAuthor && loggedInUserEmail) {
        postsToShow = publications.filter(p => p.authorEmail === loggedInUserEmail);
    }

    // Limita o número de posts (para a página inicial, por exemplo)
    if (limit) {
        postsToShow = postsToShow.slice(-limit).reverse(); // Últimos 'limit' posts, mais recentes primeiro
    } else {
        postsToShow = postsToShow.slice().reverse(); // Inverte para mostrar os mais recentes primeiro
    }

    listElement.innerHTML = ''; // Limpa a lista existente

    if (postsToShow.length === 0) {
        const noPostsMessageId = targetElementId === 'lista-publicacoes' ? 'noPostsMessage' : 'noCommunityPostsMessage';
        const noPostsMessageElement = document.getElementById(noPostsMessageId);
        if (noPostsMessageElement) {
            noPostsMessageElement.style.display = 'block';
        }
        return;
    } else {
        const noPostsMessageId = targetElementId === 'lista-publicacoes' ? 'noPostsMessage' : 'noCommunityPostsMessage';
        const noPostsMessageElement = document.getElementById(noPostsMessageId);
        if (noPostsMessageElement) {
            noPostsMessageElement.style.display = 'none';
        }
    }

    postsToShow.forEach(pub => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${pub.title}</h3>
            <p>${pub.content.substring(0, 150)}${pub.content.length > 150 ? '...' : ''}</p>
            <small>Por: ${pub.authorName} em ${formatPostDate(pub.date)}</small>
            <div class="post-actions">
                <a href="publicacao.html?id=${pub.id}" class="post-item-link-overlay"></a>
                ${filterByAuthor ? // Apenas mostra botões de editar/excluir no painel do próprio usuário
                    `<button onclick="editPublication(${pub.id})">Editar</button>
                    <button onclick="deletePublication(${pub.id})" class="delete-button">Excluir</button>`
                    : ''}
            </div>
        `;
        listElement.appendChild(li);
    });
}

// Visualizar Publicação (detalhe)
function loadPublicationDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));

    if (isNaN(postId)) {
        document.getElementById('titulo-publicacao').textContent = 'Publicação não encontrada.';
        document.getElementById('conteudo-publicacao').textContent = 'O ID da publicação é inválido ou não foi fornecido.';
        document.getElementById('pageTitle').textContent = 'Erro - Entre Páginas';
        return;
    }

    const post = publications.find(p => p.id === postId);

    if (!post) {
        document.getElementById('titulo-publicacao').textContent = 'Publicação não encontrada.';
        document.getElementById('conteudo-publicacao').textContent = 'Esta publicação pode ter sido removida ou o ID está incorreto.';
        document.getElementById('pageTitle').textContent = 'Erro - Entre Páginas';
        return;
    }

    document.getElementById('titulo-publicacao').textContent = post.title;
    document.getElementById('autor-publicacao').textContent = post.authorName;
    document.getElementById('data-publicacao').textContent = formatPostDate(post.date);
    document.getElementById('conteudo-publicacao').textContent = post.content;
    document.getElementById('pageTitle').textContent = `${post.title} - Entre Páginas`;

    // Carregar e exibir comentários
    loadComments(post.id);
}

// Adicionar Comentário
function addComment(postId) {
    const commentContentInput = document.getElementById('commentContent');
    const commentText = commentContentInput ? commentContentInput.value.trim() : '';

    if (!commentText) {
        alert('Por favor, escreva um comentário.');
        return;
    }

    const postIndex = publications.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        alert('Publicação não encontrada para adicionar o comentário.');
        return;
    }

    const newComment = {
        id: Date.now(),
        author: loggedInUserEmail ? loggedInUserEmail.split('@')[0] : 'Anônimo',
        content: commentText,
        date: new Date().toISOString()
    };

    publications[postIndex].comments.push(newComment);
    localStorage.setItem('publications', JSON.stringify(publications));
    commentContentInput.value = ''; // Limpa o campo
    loadComments(postId); // Recarrega os comentários
}

// Carregar Comentários
function loadComments(postId) {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    const post = publications.find(p => p.id === postId);
    if (!post || !post.comments) {
        commentsList.innerHTML = '<p class="info-message">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
        return;
    }

    commentsList.innerHTML = ''; // Limpa a lista existente

    if (post.comments.length === 0) {
        commentsList.innerHTML = '<p class="info-message">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
        return;
    }

    post.comments.forEach(comment => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>${comment.content}</p>
            <small>Por: ${comment.author} em ${formatPostDate(comment.date)}</small>
        `;
        commentsList.appendChild(li);
    });
}


// Editar Publicação (Redireciona para um formulário de edição)
// Por simplicidade, faremos um redirecionamento e a edição real será no mesmo form de Nova Publicação,
// mas populado com os dados existentes.
function editPublication(id) {
    const postToEdit = publications.find(p => p.id === id);
    if (postToEdit) {
        localStorage.setItem('editingPost', JSON.stringify(postToEdit));
        window.location.href = 'nova-publicacao.html?edit=' + id;
    }
}

// Carregar Publicação para Edição (na página nova-publicacao.html)
function loadPostForEditing() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = parseInt(urlParams.get('edit'));
    const titleInput = document.getElementById('titulo');
    const contentInput = document.getElementById('conteudo');
    const categorySelect = document.getElementById('categoria');
    const tagsInput = document.getElementById('tags');
    const formButton = document.querySelector('#newPostForm button[type="submit"]');

    if (editId && titleInput && contentInput && formButton) {
        const editingPost = JSON.parse(localStorage.getItem('editingPost'));
        if (editingPost && editingPost.id === editId) {
            titleInput.value = editingPost.title;
            contentInput.value = editingPost.content;
            if (categorySelect) categorySelect.value = editingPost.category || '';
            if (tagsInput) tagsInput.value = editingPost.tags ? editingPost.tags.join(', ') : '';
            formButton.textContent = 'Atualizar Publicação';
            document.querySelector('#newPostForm h1').textContent = 'Editar Publicação';

            // Altera a função onSubmit para chamar 'updatePublication'
            document.getElementById('newPostForm').onsubmit = (event) => {
                event.preventDefault();
                updatePublication(editId);
            };
        } else {
            // Se o post de edição não foi encontrado, limpa o ID de edição da URL
            const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }
    }
}

// Atualizar Publicação (após edição)
function updatePublication(id) {
    const titleInput = document.getElementById('titulo');
    const contentInput = document.getElementById('conteudo');
    const categorySelect = document.getElementById('categoria');
    const tagsInput = document.getElementById('tags');

    const title = titleInput ? titleInput.value.trim() : '';
    const content = contentInput ? contentInput.value.trim() : '';
    const category = categorySelect ? categorySelect.value : 'Outros';
    const tags = tagsInput ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];

    if (!title || !content) {
        alert('Por favor, preencha o título e o conteúdo da publicação.');
        return;
    }

    const postIndex = publications.findIndex(p => p.id === id);
    if (postIndex !== -1) {
        publications[postIndex].title = title;
        publications[postIndex].content = content;
        publications[postIndex].category = category;
        publications[postIndex].tags = tags;
        localStorage.setItem('publications', JSON.stringify(publications));
        localStorage.removeItem('editingPost'); // Limpa o item de edição
        alert('Publicação atualizada com sucesso!');
        window.location.href = 'painel-usuario.html';
    } else {
        alert('Erro: Publicação não encontrada para atualização.');
    }
}

// Excluir Publicação
function deletePublication(id) {
    if (confirm('Tem certeza que deseja excluir esta publicação?')) {
        publications = publications.filter(p => p.id !== id);
        localStorage.setItem('publications', JSON.stringify(publications));
        alert('Publicação excluída com sucesso!');
        listPublications('lista-publicacoes', true); // Recarrega a lista do painel
    }
}


// --- LÓGICA DE CONFIGURAÇÕES DE PERFIL ---

function loadProfileSettings() {
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    const profileBioTextarea = document.getElementById('profileBio');
    const currentProfilePic = document.getElementById('currentProfilePic');

    if (profileNameInput && profileEmailInput && profileBioTextarea) {
        const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
        
        // Usa o email do usuário logado, se houver
        if (loggedInUserEmail) {
            profileEmailInput.value = loggedInUserEmail;
            profileNameInput.value = userSettings[loggedInUserEmail]?.name || loggedInUserEmail.split('@')[0]; // Usa nome salvo ou parte do email
            profileBioTextarea.value = userSettings[loggedInUserEmail]?.bio || '';
            const savedPic = userSettings[loggedInUserEmail]?.profilePic;
            if (currentProfilePic && savedPic) {
                currentProfilePic.src = savedPic;
            }
        } else {
            // Caso de teste sem login (nunca deveria acontecer em página protegida)
            profileNameInput.value = 'Visitante';
            profileEmailInput.value = 'nao-logado@example.com';
            profileBioTextarea.value = 'Faça login para gerenciar seu perfil.';
            profileNameInput.disabled = true; // Desabilita edição se não houver login
            profileBioTextarea.disabled = true;
        }
    }
    loadCookiePreferences(); // Carrega as preferências de cookies também
}

function salvarConfiguracoesPerfil() {
    const profileNameInput = document.getElementById('profileName');
    const profileBioTextarea = document.getElementById('profileBio');
    const currentProfilePic = document.getElementById('currentProfilePic');
    const settingsMessageElementId = 'settingsMessage';

    if (!loggedInUserEmail) {
        showMessage(settingsMessageElementId, 'Você precisa estar logado para salvar as configurações do perfil.', true);
        return;
    }

    const name = profileNameInput ? profileNameInput.value.trim() : '';
    const bio = profileBioTextarea ? profileBioTextarea.value.trim() : '';
    const profilePic = currentProfilePic ? currentProfilePic.src : '';

    if (!name) {
        showMessage(settingsMessageElementId, 'O nome de usuário não pode estar vazio!', true);
        return;
    }

    let userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    userSettings[loggedInUserEmail] = {
        name: name,
        bio: bio,
        profilePic: profilePic
    };
    localStorage.setItem('userSettings', JSON.stringify(userSettings));

    // Atualiza o nome de usuário exibido no painel
    if (window.location.pathname.includes('painel-usuario.html')) {
        document.getElementById('userName').textContent = name;
    }

    showMessage(settingsMessageElementId, 'Configurações do perfil salvas com sucesso!', false);
}

// Simulação de upload de imagem de perfil (apenas visualização)
function handleProfilePicChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('currentProfilePic').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}


// --- LÓGICA DE COOKIES ---

function loadCookiePreferences() {
    const essentialCookies = document.getElementById('essentialCookies');
    const analyticsCookies = document.getElementById('analyticsCookies');
    const marketingCookies = document.getElementById('marketingCookies');

    if (essentialCookies && analyticsCookies && marketingCookies) {
        const cookiePreferences = JSON.parse(localStorage.getItem('cookiePreferences')) || {};
        
        // Essential são sempre true e disabled
        essentialCookies.checked = true;
        essentialCookies.disabled = true;

        analyticsCookies.checked = cookiePreferences.analytics === true;
        marketingCookies.checked = cookiePreferences.marketing === true;
    }
}

function salvarPreferenciasCookies() {
    const analyticsCookies = document.getElementById('analyticsCookies');
    const marketingCookies = document.getElementById('marketingCookies');
    const settingsMessageElementId = 'settingsMessage';

    const preferences = {
        analytics: analyticsCookies ? analyticsCookies.checked : false,
        marketing: marketingCookies ? marketingCookies.checked : false
    };

    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    showMessage(settingsMessageElementId, 'Preferências de cookies salvas com sucesso!', false);
}


// --- INICIALIZAÇÃO DA PÁGINA E EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // Atualiza a UI da navegação no carregamento da página
    updateNavUI();

    // Adiciona o listener para o botão de login/sair na navbar
    const authLink = document.getElementById('authLink');
    if (authLink) {
        authLink.addEventListener('click', handleAuthLinkClick);
    }

    // Lógica para o menu responsivo (hambúrguer)
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Funções específicas para cada página
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html') {
        listPublications('recentPostsList', false, 3); // Lista 3 publicações recentes na home
    } else if (currentPage === 'painel-usuario.html') {
        protectPage(); // Garante proteção na carga DOMContentLoaded
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan && loggedInUserEmail) {
            const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
            userNameSpan.textContent = userSettings[loggedInUserEmail]?.name || loggedInUserEmail.split('@')[0];
        }
        listPublications('lista-publicacoes', true); // Lista apenas as publicações do usuário logado
    } else if (currentPage === 'comunidade.html') {
        listPublications('lista-comunidade', false); // Lista todas as publicações na comunidade
    } else if (currentPage === 'publicacao.html') {
        loadPublicationDetails();
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const urlParams = new URLSearchParams(window.location.search);
                const postId = parseInt(urlParams.get('id'));
                if (!isNaN(postId)) {
                    addComment(postId);
                }
            });
        }
    } else if (currentPage === 'nova-publicacao.html') {
        protectPage(); // Garante proteção na carga DOMContentLoaded
        loadPostForEditing(); // Verifica se é para edição
    } else if (currentPage === 'configuracoes.html') {
        protectPage(); // Garante proteção na carga DOMContentLoaded
        loadProfileSettings();
        const profilePicInput = document.getElementById('profilePicture');
        if (profilePicInput) {
            profilePicInput.addEventListener('change', handleProfilePicChange);
        }
    }
});

// A função protectPage é chamada no <head> para garantir a proteção antes da renderização completa da página.
// Ela também é chamada aqui no DOMContentLoaded para garantir a atualização da UI no caso de alguma falha no carregamento.
// Isso é redundante mas garante a proteção em diferentes momentos do ciclo de vida da página.
if (typeof protectPage === 'function') { // Verifica se a função já foi definida no head
    protectPage();
}


// Login
function acionarBotao() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageElementId = 'errorMessage';

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!email || !password) {
        showMessage(errorMessageElementId, 'Preencha todos os campos!', true);
        return;
    }

    // Credenciais de teste da documentação
    const TEST_EMAIL = 'admin@admin';
    const TEST_PASSWORD = 'admin';

    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        localStorage.setItem('loggedInUserEmail', email);
        loggedInUserEmail = email; // Atualiza a variável global
        showMessage(errorMessageElementId, 'Login realizado com sucesso!', false);
        setTimeout(() => {
            window.location.href = 'painel-usuario.html';
        }, 1000);
    } else {
        showMessage(errorMessageElementId, 'Email ou senha incorretos. Tente novamente.', true);
    }
}

