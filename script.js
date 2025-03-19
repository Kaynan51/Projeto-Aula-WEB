// Função para o login
function acionarBotao() {
    var textEmail = document.getElementById('email').value;
    var textPassword = document.getElementById('password').value;

    if (textEmail == "") {
        alert("Preencha o campo e-mail!");
    } else if (textPassword == "") {
        alert("Preencha o campo senha!");
    } else {
        if (textEmail == "admin@admin.com" && textPassword == "admin") {
            window.location.href = 'index.html'; // Redireciona para a página inicial se for admin
        } else {
            alert("E-mail ou senha incorretos!");
        }
    }
}

// Função para o cadastro
function acionarCadastro() {
    var textNome = document.getElementById('nome').value;
    var textEmail = document.getElementById('email').value;
    var textSenha = document.getElementById('senha').value;
    var textInteresses = document.getElementById('interesses').value;
    var termos = document.getElementById('termos').checked;
    const confirmaSenha = document.getElementById("confirmaSenha").value;

    if (textNome == "Admin" && textEmail == "admin@admin.com" && textSenha == "admin") {
        window.location.href = 'login.html'; // Redireciona para o login caso o admin tente cadastrar
    }

    if (textNome == "") {
        alert("Preencha o campo nome!");
    } else if (textEmail == "") {
        alert("Preencha o campo e-mail!");
    } else if (textSenha == "") {
        alert("Preencha o campo senha!");
    } else if (textSenha.length < 6) {
        alert("A senha precisa ter pelo menos 6 caracteres!");
    } else if (!termos) {
        alert("Você precisa aceitar os termos e condições.");
    } else if (textSenha != confirmaSenha) {
        alert("As senhas não coincidem. Tente novamente.");
        return;
    } else {
        alert("Cadastro realizado com sucesso!");
        window.location.href = 'login.html'; // Redireciona para o login após cadastro
    }
}

// Função para a página "Esqueci a Senha"
function acionarRecuperacao() {
    var textEmail = document.getElementById('email').value;

    // Verifica se o e-mail é o admin
    if (textEmail == "admin@admin.com") {
        window.location.href = "login.html";
    } else {
        alert("Instruções de recuperação de senha enviadas para " + textEmail);
        window.location.href = "login.html"; // Simula o envio e redireciona para login
    }
}
