
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

onAuthStateChanged(auth, async (usuario) => {

    // =========================
    // VERIFICAR LOGIN
    // =========================

    if (!usuario) {
        window.location.href = "/login";
        return;
    }

    const listaEventos = document.getElementById("eventos-container");

    if (!listaEventos) {
        console.error("Container de eventos não encontrado.");
        return;
    }

    // =========================
    // VER MAIS / RECOLHER
    // =========================

    listaEventos.addEventListener("click", (event) => {

        // VER MAIS
        const botaoExpandir = event.target.closest(".btn-expandir");

        if (botaoExpandir) {

            const card = botaoExpandir.closest(".evento");

            if (!card) return;

            const estavaExpandido = card.classList.contains("expandido");

            // Fecha os outros cards expandidos
            listaEventos.querySelectorAll(".evento.expandido")
                .forEach((outroCard) => {
                    outroCard.classList.remove("expandido");
                });

            // Abre o card clicado, se estava fechado
            if (!estavaExpandido) {
                card.classList.add("expandido");
            }

            return;
        }

        // RECOLHER
        const botaoRecolher = event.target.closest(".btn-recolher");

        if (botaoRecolher) {

            const card = botaoRecolher.closest(".evento");

            if (card) {
                card.classList.remove("expandido");
            }
        }

    });

    // =========================
    // BUSCAR EVENTOS NO FIREBASE
    // =========================

    const referenciaEventos = ref(db, "Eventos/");

    onValue(referenciaEventos, (snapshot) => {

        listaEventos.innerHTML = "";

        const dadosEventos = snapshot.val();

        if (!dadosEventos) {
            listaEventos.innerHTML = `
                <p class="nenhum-evento">
                    Você ainda não criou nenhum evento.
                </p>
            `;
            return;
        }

        let encontrouEvento = false;

        for (let i in dadosEventos) {

            const currentEvento = dadosEventos[i];

            if (!currentEvento) continue;

            // Exibe somente os eventos criados pelo usuário logado
            if (currentEvento.criador !== usuario.uid) {
                continue;
            }

            let idSala = currentEvento.codigo_sala

            encontrouEvento = true;

            listaEventos.innerHTML += `
                <div class="evento">

                    <div class="evento-header">

                        <div class="titulo-tema">

                            <h2 class="evento-titulo">
                                ${currentEvento.nome || ""}
                            </h2>

                            <h4 class="evento-tema">
                                ${currentEvento.tema || "Sem tema"}
                            </h4>

                        </div>

                        <div class="inscricoes-info">

                            <span class="evento-pessoas inscritostxt">
                                Inscritos: ${currentEvento.inscricoes || 0}
                            </span>

                            <span class="evento-pessoas">
                                Limite de inscrições:
                                ${currentEvento.vagas ?? "ilimitado"}
                            </span>

                        </div>

                    </div>

                    <div class="evento-acoes">

                        <a
                            class="btn-visualizar-evento"
                            href="/eventos/visualizar-evento/${String(i)}"
                        >
                            Visualizar
                        </a>
                        <a
                            class="btn-visualizar-evento"
                            href="/salas/sala-geral/${String(idSala)}"
                        >
                            Entrar na sala
                        </a>

                        <button type="button" class="btn-expandir">

                            <span>Ver mais</span>

                            <span class="seta">
                                <img
                                    src="/assets/img/down-arrow_visualizar.png"
                                    width="25"
                                    alt=""
                                >
                            </span>

                        </button>

                    </div>

                    <div class="evento-descricao">

                        <h3>Descrição</h3>

                        <p class="descricao">
                            ${currentEvento.descricao || "Nenhuma descrição informada."}
                        </p>

                        <hr>

                        <h3>Local</h3>

                        <p class="local">
                            ${currentEvento.local || "Local não informado."}
                        </p>

                        <hr>

                        <h3>Data</h3>

                        <p class="data">
                            ${currentEvento.data || "Data não informada."}
                        </p>

                        <hr>

                        <h3>Horário</h3>

                        <p class="horario">
                            ${
                                currentEvento.horarioInicio &&
                                currentEvento.horarioTermino
                                    ? `${currentEvento.horarioInicio} às ${currentEvento.horarioTermino}`
                                    : "Horário não informado."
                            }
                        </p>

                        <button type="button" class="btn-recolher">

                            <span>Recolher</span>

                            <span class="seta">
                                <img
                                    src="/assets/img/down-arrow_visualizar.png"
                                    width="25"
                                    alt=""
                                >
                            </span>

                        </button>

                    </div>

                </div>
            `;
        }

    });

});
