document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", function(event) {
        // Captura os valores dos campos
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        let valid = true;

        // Validação de e-mail
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, insira um e-mail válido.");
            valid = false;
        }

        // Validação de senha
        if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            valid = false;
        }

        // Se algum dos campos não for válido, impede o envio do formulário
        if (!valid) {
            event.preventDefault();
        }
    });
});
