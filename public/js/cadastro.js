import { db, auth } from "./firebase.js";

import { ref, set } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

import { 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const formulario = document.getElementById("formulario")


formulario.addEventListener('submit', async (event) => {
    event.preventDefault()

    let nome = document.getElementById("nome")
    let email = document.getElementById("email")
    let senha = document.getElementById("senha")
    let confirmSenha = document.getElementById("confirmaSenha")
    let txtNome = document.getElementById("txtNome")
    let txtEmail = document.getElementById("txtEmail")
    let txtSenha = document.getElementById("txtSenha")
    let txtSenhaConfirmada = document.getElementById("txtSenhaConfirmada")

    try {
    const resposta = await fetch("/cadastros", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        nome: nome.value,
        email: email.value,
        senha: senha.value,
        confirmacaoSenha: confirmSenha.value
    })
});

const dados = await resposta.json();

if (dados.erroNome) {
    nome.classList.add("erro");
    nome.classList.remove("certo");
    txtNome.innerText = dados.erroNome
    txtNome.classList.remove("correto")
    txtNome.classList.add("errado");
} else {
    nome.classList.remove("erro");
    nome.classList.add("certo");
    txtNome.innerText = "Nome válido"
    txtNome.classList.add("correto")
    txtNome.classList.remove("errado")
}

if (dados.erroEmail) {
    email.classList.add("erro");
    email.classList.remove("certo");
    txtEmail.innerText= dados.erroEmail
    txtEmail.classList.remove("correto")
    txtEmail.classList.add("errado")
} else {
    email.classList.remove("erro");
    email.classList.add("certo");
    txtEmail.innerText = "Email válido"
    txtEmail.classList.remove("errado")
    txtEmail.classList.add("correto")
}

if (dados.erroSenha) {
    senha.classList.add("erro");
    senha.classList.remove("certo");
    txtSenha.innerText = dados.erroSenha
    txtSenha.classList.remove("correto")
    txtSenha.classList.add("errado")
} else {
    senha.classList.remove("erro");
    senha.classList.add("certo");
    txtSenha.innerText = "Senha válida"
    txtSenha.classList.remove("errado")
    txtSenha.classList.add("correto")
}

if (dados.erroConfirmacao) {
    confirmSenha.classList.add("erro");
    confirmSenha.classList.remove("certo");
    txtSenhaConfirmada.innerText = dados.erroConfirmacao
    txtSenhaConfirmada.classList.remove("correto")
    txtSenhaConfirmada.classList.add("errado")
} else {
    confirmSenha.classList.remove("erro");
    confirmSenha.classList.add("certo");
    txtSenhaConfirmada.innerText = "Senhas iguais"
    txtSenhaConfirmada.classList.remove("errado")
    txtSenhaConfirmada.classList.add("correto")
}

if (!resposta.ok) {
    return;
}

// Só chega aqui se o Node aprovou os dados
const usuario = await createUserWithEmailAndPassword(
    auth,
    email.value,
    senha.value
);

const uid = usuario.user.uid

await set(ref(db,`Usuários/${uid}`), {
    nome: nome.value,
    email: email.value
})

    window.location.href = "index"
    
    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar usuário.");
    }

})