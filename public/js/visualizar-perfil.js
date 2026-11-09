
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    ref,
    get,
    onValue
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// =========================
// BOTÃO DE SAIR
// =========================

const sair = document.getElementById("logout");

if (sair) {

    sair.addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "/login";

    });

}


// =========================
// BOTÃO DO PERFIL LOGADO
// =========================

const perfil = document.getElementById("perfil");

if (perfil) {

    perfil.addEventListener("click", () => {

        window.location.href = "/home/perfil";

    });

}


// =========================
// UID DO USUÁRIO SELECIONADO
// =========================

const uid = document.getElementById("uid").value.trim();

console.log("UID do perfil:", uid);


// =========================
// CRIAR CARD DE EVENTO
// =========================

function criarCardEvento(evento) {

    const card = document.createElement("div");
    card.className = "evento";

    const infoEvento = document.createElement("div");
    infoEvento.className = "info-evento";

    const titulo = document.createElement("p");
    titulo.className = "tituloEvento";
    titulo.textContent = evento.nome || "Evento sem nome";

    const tema = document.createElement("p");
    tema.className = "enderecoEvento";
    tema.textContent = evento.tema || "Sem tema";

    infoEvento.appendChild(titulo);
    infoEvento.appendChild(tema);

    card.appendChild(infoEvento);

    return card;

}


// =========================
// CRIAR CARD DE SALA
// =========================

function criarCardSala(sala) {

    const card = document.createElement("div");
    card.className = "sala";

    const infoSala = document.createElement("div");
    infoSala.className = "info-sala";

    const titulo = document.createElement("p");
    titulo.className = "tituloSala";
    titulo.textContent = sala.nome || "Sala sem nome";

    const categoria = document.createElement("p");
    categoria.className = "temaSala";
    categoria.textContent = sala.categoria || "Sem categoria";

    infoSala.appendChild(titulo);
    infoSala.appendChild(categoria);

    card.appendChild(infoSala);

    return card;

}


// =========================
// LISTAR CARDS
// =========================

function montarListagem(container, registros, criarCard, mensagem) {

    container.innerHTML = "";

    if (registros.length === 0) {

        const texto = document.createElement("p");

        texto.className = "sem-registros";
        texto.textContent = mensagem;

        container.appendChild(texto);

        return;

    }


    // =========================
    // MOSTRAR ATÉ 5 REGISTROS
    // =========================

    function mostrarItens(mostrarTodos) {

        container.innerHTML = "";

        const quantidade = mostrarTodos
            ? registros.length
            : 5;

        for (let i = 0; i < registros.length && i < quantidade; i++) {

            const registro = registros[i];

            const card = criarCard(registro);

            container.appendChild(card);

        }


        // =========================
        // BOTÃO VER MAIS
        // =========================

        if (registros.length > 5) {

            const botao = document.createElement("button");

            botao.type = "button";
            botao.className = "verMais";

            if (mostrarTodos) {

                botao.textContent = "Ver menos";

            } else {

                botao.textContent = "Ver mais";

            }

            botao.addEventListener("click", () => {

                mostrarItens(!mostrarTodos);

            });

            container.appendChild(botao);

        }

    }

    mostrarItens(false);

}


// =========================
// VERIFICAR LOGIN
// =========================

onAuthStateChanged(auth, async (usuario) => {

    if (!usuario) {

        window.location.href = "/login";

        return;

    }


    // =========================
    // ELEMENTOS DO HTML
    // =========================

    const mensagemPerfil =
        document.getElementById("mensagemPerfil");

    const conteudoPerfil =
        document.getElementById("conteudoPerfil");

    const nomeText =
        document.getElementById("nomeText");

    const emailText =
        document.getElementById("emailText");

    const recadoText =
        document.getElementById("recado");

    const info =
        document.getElementById("info");

    const listaQualidades =
        document.getElementById("listar-qualidade");


    // =========================
    // VERIFICAR UID SELECIONADO
    // =========================

    if (!uid) {

        mensagemPerfil.textContent =
            "Nenhum usuário foi selecionado.";

        return;

    }


    // =========================
    // DADOS DO HEADER
    // USUÁRIO LOGADO
    // =========================

    try {

        const referenciaUsuarioLogado = ref(
            db,
            `Usuários/${usuario.uid}`
        );

        const snapshotUsuarioLogado =
            await get(referenciaUsuarioLogado);

        const dadosLogado =
            snapshotUsuarioLogado.val() || {};

        const nomeLogado =
            dadosLogado.nome || usuario.displayName || "Usuário";

        const emailLogado =
            dadosLogado.email || usuario.email || "";

        const primeiraLetra =
            document.getElementById("primeira-letra");

        const nomeHeader =
            document.getElementById("nome");

        const emailHeader =
            document.getElementById("email");

        if (primeiraLetra) {

            primeiraLetra.innerText =
                String(nomeLogado[0]).toUpperCase();

        }

        if (nomeHeader) {

            nomeHeader.innerText = nomeLogado;

        }

        if (emailHeader) {

            emailHeader.innerText = emailLogado;

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar dados do header:",
            erro
        );

    }


    // =========================
    // REFERÊNCIA DO USUÁRIO
    // SELECIONADO
    // =========================

    try {

        const referencia = ref(
            db,
            `Usuários/${uid}`
        );


        // =========================
        // BUSCAR DADOS DO USUÁRIO
        // =========================

        const snapshot = await get(referencia);

        const dados = snapshot.val();


        // =========================
        // VERIFICAR SE EXISTE
        // =========================

        if (!dados) {

            mensagemPerfil.textContent =
                "Perfil não encontrado.";

            return;

        }


        // =========================
        // DADOS DO USUÁRIO
        // =========================

        nomeText.innerText =
            String(dados.nome || "Sem nome").toUpperCase();

        emailText.innerText =
            dados.email || "E-mail não informado";


        // =========================
        // RECADO DO USUÁRIO
        // =========================

        if (dados.recado) {

            recadoText.innerText = dados.recado;

        } else {

            recadoText.innerText =
                "Este usuário ainda não deixou um recado.";

        }


        // =========================
        // DESCRIÇÃO DO USUÁRIO
        // =========================

        if (dados.descricao) {

            info.innerText = dados.descricao;

        } else {

            info.innerText =
                "Este usuário ainda não adicionou uma descrição.";

        }


        // =========================
        // LISTAR QUALIDADES
        // =========================

        listaQualidades.innerHTML = "";

        if (dados.qualidades) {

            for (let id in dados.qualidades) {

                const qualidadeAtual =
                    dados.qualidades[id];

                if (!qualidadeAtual) {
                    continue;
                }

                const qualidadeText =
                    document.createElement("p");

                qualidadeText.textContent =
                    String(qualidadeAtual);

                listaQualidades.appendChild(
                    qualidadeText
                );

            }

        }


        // =========================
        // VERIFICAR QUALIDADES VAZIAS
        // =========================

        if (listaQualidades.children.length === 0) {

            const mensagem = document.createElement("p");

            mensagem.textContent =
                "Nenhuma qualidade cadastrada.";

            listaQualidades.appendChild(mensagem);

        }


        // =========================
        // MOSTRAR PERFIL
        // =========================

        mensagemPerfil.hidden = true;

        conteudoPerfil.hidden = false;


        // =========================
        // EVENTOS CRIADOS E INSCRITOS
        // =========================

        onValue(
            ref(db, "Eventos"),
            (snapshotEventos) => {

                const eventos = snapshotEventos.val() || {};

                const listaCriados = [];
                const listaInscritos = [];


                // =========================
                // PERCORRER EVENTOS
                // =========================

                for (let i in eventos) {

                    const eventoAtual = eventos[i];

                    if (!eventoAtual) {
                        continue;
                    }


                    // =========================
                    // EVENTOS CRIADOS
                    // =========================

                    if (eventoAtual.criador === uid) {

                        listaCriados.push(eventoAtual);

                    }


                    // =========================
                    // EVENTOS INSCRITOS
                    // =========================

                    if (eventoAtual.criador === uid) {
                        continue;
                    }

                    if (!eventoAtual.Participantes) {
                        continue;
                    }

                    if (eventoAtual.Participantes[uid]) {

                        listaInscritos.push(eventoAtual);

                    }

                }


                // =========================
                // CONTADORES DOS EVENTOS
                // =========================

                document.getElementById(
                    "n_eventosCriados"
                ).textContent = String(listaCriados.length);

                document.getElementById(
                    "n_eventosInscritos"
                ).textContent = String(listaInscritos.length);


                // =========================
                // MOSTRAR EVENTOS CRIADOS
                // =========================

                montarListagem(
                    document.getElementById("eventosCriados"),
                    listaCriados,
                    criarCardEvento,
                    "Nenhum evento criado."
                );


                // =========================
                // MOSTRAR EVENTOS INSCRITOS
                // =========================

                montarListagem(
                    document.getElementById("eventosInscritos"),
                    listaInscritos,
                    criarCardEvento,
                    "Nenhum evento inscrito."
                );

            },
            (erro) => {

                console.error(
                    "Erro ao carregar eventos:",
                    erro
                );

                document.getElementById(
                    "eventosCriados"
                ).textContent = "Não foi possível carregar os eventos.";

                document.getElementById(
                    "eventosInscritos"
                ).textContent = "Não foi possível carregar os eventos.";

            }
        );


        // =========================
        // SALAS CRIADAS E INSCRITAS
        // =========================

        onValue(
            ref(db, "Salas"),
            (snapshotSalas) => {

                const salas = snapshotSalas.val() || {};

                const listaCriadas = [];
                const listaInscritas = [];


                // =========================
                // PERCORRER SALAS
                // =========================

                for (let i in salas) {

                    const salaAtual = salas[i];

                    if (!salaAtual) {
                        continue;
                    }


                    // =========================
                    // SALAS CRIADAS
                    // =========================

                    if (salaAtual.criador === uid) {

                        listaCriadas.push(salaAtual);

                    }


                    // =========================
                    // SALAS INSCRITAS
                    // =========================

                    if(salaAtual.criador === uid){
                    continue;
                    
                    }

                    if (!salaAtual.Integrantes) {
                        continue;
                    }

                    if (salaAtual.Integrantes[uid]) {

                        listaInscritas.push(salaAtual);

                    }
                    

                }


                // =========================
                // CONTADORES DAS SALAS
                // =========================

                document.getElementById(
                    "n_salasCriadas"
                ).textContent = String(listaCriadas.length);

                document.getElementById(
                    "n_salasInscritas"
                ).textContent = String(listaInscritas.length);


                // =========================
                // MOSTRAR SALAS CRIADAS
                // =========================

                montarListagem(
                    document.getElementById("salasCriadas"),
                    listaCriadas,
                    criarCardSala,
                    "Nenhuma sala criada."
                );


                // =========================
                // MOSTRAR SALAS INSCRITAS
                // =========================

                
                montarListagem(
                    document.getElementById("salasInscritas"),
                    listaInscritas,
                    criarCardSala,
                    "Nenhuma sala inscrita."
                );

            },
            (erro) => {

                console.error(
                    "Erro ao carregar salas:",
                    erro
                );

                document.getElementById(
                    "salasCriadas"
                ).textContent = "Não foi possível carregar as salas.";

                document.getElementById(
                    "salasInscritas"
                ).textContent = "Não foi possível carregar as salas.";

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );

        mensagemPerfil.textContent =
            "Não foi possível carregar este perfil.";

    }

});
