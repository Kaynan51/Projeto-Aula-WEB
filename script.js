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
            localStorage.setItem("logado", "true");
            window.location.href = 'index.html';
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
    } else if (textSenha != confirmaSenha) {
        alert("As senhas não coincidem. Tente novamente.");
        return;
    } else {
        alert("Cadastro realizado com sucesso!");
        window.location.href = 'login.html';
    }
}

// Função para recuperação de senha
function acionarRecuperacao() {
    var textEmail = document.getElementById('email').value;

    if (textEmail == "admin@admin.com") {
        window.location.href = "login.html";
    } else {
        alert("Instruções de recuperação de senha enviadas para " + textEmail);
        window.location.href = "login.html";
    }
}

// Busca endereço pelo CEP
function buscarEnderecoPorCEP() {
    const cep = document.getElementById("cep").value.trim();

    if (!/^\d{8}$/.test(cep)) {
        alert("CEP inválido. Deve conter exatamente 8 números.");
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado.");
                document.getElementById("endereco").value = "";
            } else {
                const enderecoCompleto = `${data.logradouro}, ${data.bairro}`;
                document.getElementById("endereco").value = enderecoCompleto;
            }
        })
        .catch(error => {
            console.error("Erro ao buscar o CEP:", error);
            alert("Erro ao buscar o CEP. Tente novamente mais tarde.");
        });
}

// Validação de formulário
function validarFormulario() {
    const nome = document.getElementById("nome").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value;
    const renda = document.getElementById("rendaFamiliar").value;
    const endereco = document.getElementById("endereco").value;

    if (nome === "") {
        alert("Por favor, preencha o nome.");
        return;
    }

    if (!validarIdade(dataNascimento)) {
        alert("Você deve ser maior de idade para se cadastrar.");
        return;
    }

    if (!validarRenda(renda)) {
        alert("A renda familiar deve ser um número positivo.");
        return;
    }

    if (endereco === "") {
        alert("Preencha um CEP válido para obter o endereço.");
        return;
    }

    alert("Formulário enviado com sucesso!");
}

function validarIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade >= 18;
}

function validarRenda(valor) {
    const renda = parseFloat(valor);
    return !isNaN(renda) && renda > 0;
}

// Chave da API do OpenWeather
const API_KEY = 'a6217c9de83a26fd46630969282dc8d6';

// Temperatura por cidade
async function obterTemperaturaPorCidade() {
    const cidade = document.getElementById("cidade").value.trim();
    const elementoTemperatura = document.getElementById("temperatura");

    if (!cidade) {
        alert("Por favor, digite o nome da cidade.");
        return;
    }

    elementoTemperatura.innerHTML = "Buscando a temperatura...";

    try {
        const resposta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${API_KEY}`);
        if (!resposta.ok) throw new Error(`Erro na resposta: ${resposta.status}`);

        const dadosClima = await resposta.json();

        if (dadosClima.cod === 200) {
            const temperatura = dadosClima.main.temp;
            elementoTemperatura.innerHTML = `A temperatura em ${cidade} é ${temperatura.toFixed(1)}°C.`;
        } else {
            elementoTemperatura.innerHTML = "Cidade não encontrada.";
        }
    } catch (error) {
        console.error("Erro ao obter dados do clima:", error);
        elementoTemperatura.innerHTML = "Erro ao buscar a temperatura.";
    }
}

// Temperatura por geolocalização (chamada automática após login)
async function mostrarTemperaturaAutomaticamente() {
    const elementoTemperatura = document.getElementById("temperatura");

    if (!elementoTemperatura) return;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                const resposta = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
                const dadosClima = await resposta.json();

                if (dadosClima.cod === 200) {
                    const temperatura = dadosClima.main.temp;
                    elementoTemperatura.innerHTML = `${temperatura.toFixed(1)}°C`;
                } else {
                    elementoTemperatura.innerHTML = "--°C";
                }
            } catch (error) {
                console.error("Erro ao obter dados do clima:", error);
                elementoTemperatura.innerHTML = "--°C";
            }
        }, () => {
            elementoTemperatura.innerHTML = "--°C";
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const estaLogado = localStorage.getItem("logado") === "true";
    if (estaLogado) {
        mostrarTemperaturaAutomaticamente();
    }
});

const btnCidade = document.getElementById("obterTemperaturaBtn");
if (btnCidade) {
    btnCidade.addEventListener("click", obterTemperaturaPorCidade);
}

const btnLocalizacao = document.getElementById("obterTemperaturaLocalBtn");
if (btnLocalizacao) {
    btnLocalizacao.addEventListener("click", mostrarTemperaturaAutomaticamente);
}
