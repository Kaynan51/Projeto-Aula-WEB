function acionarBotao() {
    var textEmail = document.getElementById('email').value;
    var textPassword = document.getElementById('password').value;

    if (textEmail == "") {
        alert("Preencha o campo e-mail!");
    } else if (textPassword == "") {
        alert("Preencha o campo senha!");
    } else {
        
        if (textEmail == "admin@admin.com" && textPassword == "admin") {
            window.location.href = 'index.html';
        } else {
            alert("E-mail ou senha incorretos!");
        }
    }
}
function acionarCadastro() {
    var textNome = document.getElementById('nome').value;
    var textEmail = document.getElementById('email').value;
    var textSenha = document.getElementById('senha').value;
    var textInteresses = document.getElementById('interesses').value;
    var termos = document.getElementById('termos').checked;

    if (textNome == "Admin" && textEmail == "admin@admin.com" && textSenha == "admin") {
        window.location.href = 'login.html';
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
    } else {

        alert("Cadastro realizado com sucesso!");
        window.location.href = 'login.html';
    }
}
