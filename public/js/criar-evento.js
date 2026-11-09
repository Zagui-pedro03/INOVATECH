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

    const formulario = document.getElementById("formulario");
    const usuarioCurrent = usuario.uid;

    let selectLimite = document.getElementById("tipoLimite");
    let definirLimite = document.getElementById("vagas");
    let textoLabelLimite = document.getElementById("txtVaga");
    let verificacao = true;


    function verificarLimite() {

        if (selectLimite.value === "ilimitado") {

            definirLimite.style.display = "none";
            textoLabelLimite.innerText = "Quantidade ilimitada";
            verificacao = false;

        } else {

            definirLimite.style.display = "block";
            textoLabelLimite.innerText = "Quantidade de pessoas";
            verificacao = true;
        }
    }


    // Verifica quando o usuário troca a opção
    selectLimite.addEventListener("change", verificarLimite);

    // Verifica a opção inicial ao carregar a página
    verificarLimite();


    formulario.addEventListener("submit", async (event) => {

        event.preventDefault();

        let nome = document.getElementById("nome");
        let data = document.getElementById("data");
        let local = document.getElementById("local");
        let horarioInicio = document.getElementById("horarioInicio");
        let horarioTermino = document.getElementById("horarioTermino");
        let descricao = document.getElementById("descricao");
        let quantVagas = null;
        let contadorInscritos = 0;
        let tema = document.getElementById("tema")

        if (verificacao === true) {
            quantVagas = document.getElementById("vagas").value;
        }


        const resposta = await fetch("/eventos/criar-evento", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                nome: nome.value,
                data: data.value,
                local: local.value,
                horarioInicio: horarioInicio.value,
                horarioTermino: horarioTermino.value,
                quantVagas: quantVagas,
                descricao: descricao.value,
                tema: tema.value

            })
        });


        const dados = await resposta.json();


        if (!resposta.ok) {

            // CAMPO NOME //

            if (dados.errorNome) {
                nome.classList.remove("correto");
                nome.classList.add("errado");

                document.getElementById("txtNome").classList.remove("certo")
                document.getElementById("txtNome").classList.add("erro")

                document.getElementById("txtNome").innerText =
                    dados.errorNome

            } else {
                nome.classList.remove("errado");
                nome.classList.add("correto");

                document.getElementById("txtNome").classList.remove("erro")
                document.getElementById("txtNome").classList.add("certo")

                document.getElementById("txtNome").innerText =
                    "Nome válido!";
            }


            // CAMPO DATA //

            if (dados.errorData) {
                data.classList.remove("correto");
                data.classList.add("errado");
            
                document.getElementById("txtData").classList.remove("certo")
                document.getElementById("txtData").classList.add("erro")

                document.getElementById("txtData").innerText =
                    dados.errorData;

            } else {
                data.classList.remove("errado");
                data.classList.add("correto");

                document.getElementById("txtData").classList.remove("erro")
                document.getElementById("txtData").classList.add("certo")

                document.getElementById("txtData").innerText =
                    "Data válida!";
            }


            // CAMPO LOCAL //

            if (dados.errorLocal) {
                local.classList.remove("correto");
                local.classList.add("errado");

                 document.getElementById("txtLocal").classList.remove("certo")
                 document.getElementById("txtLocal").classList.add("erro")

                document.getElementById("txtLocal").innerText =
                    dados.errorLocal;

            } else {
                local.classList.remove("errado");
                local.classList.add("correto");

                document.getElementById("txtLocal").classList.remove("erro")
                 document.getElementById("txtLocal").classList.add("certo")

                document.getElementById("txtLocal").innerText =
                    "Local válido!";
            }


            // CAMPO HORÁRIO DE INÍCIO //

            if (dados.errorHorarioInicio) {
                horarioInicio.classList.remove("correto");
                horarioInicio.classList.add("errado");

                document.getElementById("txtHorarioInicio").classList.remove("certo")
                document.getElementById("txtHorarioInicio").classList.add("erro")

                document.getElementById("txtHorarioInicio").innerText =
                    dados.errorHorarioInicio;

            } else {
                horarioInicio.classList.remove("errado");
                horarioInicio.classList.add("correto");

                document.getElementById("txtHorarioInicio").classList.remove("erro")
                document.getElementById("txtHorarioInicio").classList.add("certo")

                document.getElementById("txtHorarioInicio").innerText =
                    "Horário válido!";
            }


            // CAMPO HORÁRIO DE TÉRMINO //

            if (dados.errorHorarioTermino) {
                horarioTermino.classList.remove("correto");
                horarioTermino.classList.add("errado");

                document.getElementById("txtHorarioTermino").classList.remove("certo")
                document.getElementById("txtHorarioTermino").classList.add("erro")

                document.getElementById("txtHorarioTermino").innerText =
                    dados.errorHorarioTermino;

            } else {
                horarioTermino.classList.remove("errado");
                horarioTermino.classList.add("correto");

                 document.getElementById("txtHorarioTermino").classList.remove("erro")
                document.getElementById("txtHorarioTermino").classList.add("certo")

                document.getElementById("txtHorarioTermino").innerText =
                    "Horário válido!";
            }

            // CAMPO DE TEMAS //
            if (dados.errorTema) {
                tema.classList.remove("correto");
                tema.classList.add("errado");

                document.getElementById("txtTema").classList.remove("certo")
                document.getElementById("txtTema").classList.add("erro")

                document.getElementById("txtTema").innerText =
                    dados.errorTema;

            } else {
                tema.classList.remove("errado");
                tema.classList.add("correto");

                 document.getElementById("txtTema").classList.remove("erro")
                document.getElementById("txtTema").classList.add("certo")

                document.getElementById("txtTema").innerText =
                    "Tema válido!";
            }


            // CAMPO VAGAS //

            if (verificacao === true) {

                if (dados.errorQuantVagas) {
                    definirLimite.classList.remove("correto");
                    definirLimite.classList.add("errado");

                    document.getElementById("txtVagas").classList.remove("certo")
                    document.getElementById("txtVagas").classList.add("erro")

                    document.getElementById("txtVagas").innerText =
                        dados.errorQuantVagas;

                } else {
                    definirLimite.classList.remove("errado");
                    definirLimite.classList.add("correto");

                     document.getElementById("txtVagas").classList.remove("erro")
                     document.getElementById("txtVagas").classList.add("certo")

                    document.getElementById("txtVagas").innerText =
                        "Quantidade válida!";
                }
            } else {
                document.getElementById("txtVagas").innerText = ""
            }


            // CAMPO DESCRIÇÃO //

            if (dados.errorDescricao) {
                descricao.classList.remove("correto");
                descricao.classList.add("errado");

                document.getElementById("txtDescricao").classList.remove("certo")
                document.getElementById("txtDescricao").classList.add("erro")

                document.getElementById("txtDescricao").innerText =
                    dados.errorDescricao;

            } else {
                descricao.classList.remove("errado");
                descricao.classList.add("correto");

                document.getElementById("txtDescricao").classList.remove("erro")
                document.getElementById("txtDescricao").classList.add("certo")

                document.getElementById("txtDescricao").innerText =
                    "Descrição válida!";
            }

        } else 

            

    try {

        // CRIA UMA REFERÊNCIA PARA UM NOVO EVENTO E UMA NOVA SALA
        const novoEvento = push(ref(db, "Eventos/"));
        const novaSala = push(ref(db, `Salas/`));

        // CÓDIGOS DO NOVO EVENTO E DA NOVA SALA
        const uidEvento = novoEvento.key
        const uidSala = novaSala.key

        // SALVA OS DADOS NO FIREBASE
        await set(novoEvento, {
            codigo_sala: uidSala,
            nome: nome.value.trim(),
            data: data.value,
            local: local.value.trim(),
            horarioInicio: horarioInicio.value,
            horarioTermino: horarioTermino.value,

            vagas: verificacao
                ? Number(quantVagas)
                : "ilimitado",

            descricao: descricao.value.trim(),
            inscricoes: contadorInscritos + 1,
            tema: tema.value,
            criador: usuarioCurrent,
            Participantes: {
            [usuarioCurrent]: true
    }
            
        });

        await set(novaSala,{
            nome: nome.value.trim(),
            criador: usuarioCurrent,
            descricao: descricao.value.trim(),
            categoria: tema.value,
            Integrantes: {
                [usuarioCurrent]: true
            },
            codigo_evento : uidEvento
        })

        formulario.reset();
        window.location.href = "/eventos"
        // Atualiza o campo de limite após limpar o formulário
        verificarLimite();

    } catch (erro) {

        console.error("Erro ao cadastrar evento:", erro);

        alert("Não foi possível cadastrar o evento.");

    }


    });

});