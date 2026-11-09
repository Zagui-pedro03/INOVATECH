import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


onAuthStateChanged(auth, async (usuario) => {

    if (!usuario) {
        // Não está logado
        window.location.href = "login";
        return;
    }

    const formulario = document.getElementById('formulario')
    const usuarioCurrent = usuario.uid

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault()

        let nome = document.getElementById("nome")
        let categoria = document.getElementById("categoria")
        let descricao = document.getElementById("descricao")
        let privacidade = document.getElementById("privacidade")

        const resposta = await fetch("/salas/criar-sala", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome : nome.value,
                categoria : categoria.value,
                descricao : descricao.value
            })

        })

        const dados = await resposta.json()

        
        if(!dados.correto){
            validarCampo(dados.errorNome, nome, document.getElementById('txtNome'), "Nome válido!")
        validarCampo(dados.errorCategoria, categoria, document.getElementById('txtCategoria'), "Categoria válida!")
        validarCampo(dados.errorDescricao, descricao, document.getElementById('txtDescricao'), "Descrição válida!")
        } else {

            const novaSala = push(ref(db, "Salas/"));
            await set(novaSala, {
                nome : nome.value,
                categoria : categoria.value,
                descricao : descricao.value,
                privacidade : privacidade.value,
                criador : usuario.uid,
                Integrantes: {
            [usuarioCurrent]: true
                },
                n_inscritos: 1,
                

            })

         

            formulario.reset()

            window.location.href = "/salas"
            }
    })
    

    window.validarCampo = function(erro, campo, mensagem, textoCorreto){

        campo.classList.remove("correto", "errado");
        mensagem.classList.remove("erro", "sucesso");

        if(erro){
            campo.classList.add('errado');
            mensagem.innerText = erro;
            mensagem.classList.add('erro')
        } else {
            campo.classList.add('correto')
            mensagem.innerText = textoCorreto;
            mensagem.classList.add('sucesso')
        }

    }

})