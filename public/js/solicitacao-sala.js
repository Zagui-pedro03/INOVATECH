
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    ref,
    get,
    onValue,
    set,
    update,
    remove,
    increment
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


const sair = document.getElementById('logout');

sair.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "/login";
});

const perfil = document.getElementById('perfil');

perfil.addEventListener('click', () => {
    window.location.href = "/home/perfil";
});


onAuthStateChanged(auth, async (usuario) => {

    if (!usuario) {
        window.location.href = "/login";
        return;
    }

    // DADOS DO USUÁRIO LOGADO

    const referenciaUsuario = ref(
        db,
        `Usuários/${usuario.uid}`
    );

    const snapshotUsuario = await get(referenciaUsuario);
    const dadosUsuario = snapshotUsuario.val();

    const primeiraLetra = document.getElementById("primeira-letra");

    if (primeiraLetra && dadosUsuario?.nome) {
        primeiraLetra.innerText =
            String(dadosUsuario.nome[0]).toUpperCase();
    }

    const nome = document.getElementById("nome");
    const email = document.getElementById("email");

    if (nome) {
        nome.innerText = String(dadosUsuario?.nome || "");
    }

    if (email) {
        email.innerText = String(dadosUsuario?.email || "");
    }


    // SOLICITAÇÕES DE ENTRADA

    const currentUsuario = usuario.uid;
    const lista = document.getElementById("solicitacao-container");

    onValue(ref(db, "Salas/"), async (snapshotSalas) => {

        lista.innerHTML = "";

        const dadosSalas = snapshotSalas.val();

        if (!dadosSalas) return;

        // Percorre todas as salas
        for (let idSala in dadosSalas) {

            const currentSala = dadosSalas[idSala];

            // Verifica se a sala pertence ao usuário logado
            // e se sua privacidade é privada

            if (
                currentSala.criador === currentUsuario &&
                currentSala.privacidade === "privada"
            ) {

                // Busca os integrantes da sala

                const refIntegrantes = ref(
                    db,
                    `Salas/${idSala}/Integrantes`
                );

                const snapshotIntegrantes = await get(refIntegrantes);
                const dadosIntegrantes = snapshotIntegrantes.val();

                if (!dadosIntegrantes) continue;

                // Percorre todos os integrantes da sala

                for (let uid in dadosIntegrantes) {

                    const statusIntegrante = dadosIntegrantes[uid];

                    // Verifica se o usuário está pendente

                    if (statusIntegrante === "pendente") {

                        // Busca os dados pelo UID do integrante

                        const refDadosUsuario = ref(
                            db,
                            `Usuários/${uid}`
                        );

                        const snapshotDadosUsuario = await get(refDadosUsuario);
                        const dadosUsuarioPendente = snapshotDadosUsuario.val();

                        if (!dadosUsuarioPendente) continue;

                        // Exibe a solicitação

                        lista.innerHTML += `
                            <div class="solicitacao">

                                <div class="area-superior">

                                    <div class="usuarioInfo">
                                        <h3>${dadosUsuarioPendente.nome}</h3>
                                        <h4>Sala: ${currentSala.nome}</h4>
                                        <p>${dadosUsuarioPendente.email}</p>
                                    </div>

                                    <div class="visualizar">
                                        <button
                                            onclick="window.location.href='/perfil/${uid}'"
                                        >
                                            Ver perfil
                                        </button>
                                    </div>

                                </div>

                                <div class="area-inferior">

                                    <div class="botoesAcao">
                                        <div class="btnPermitir" onclick = "permitir('${uid}', '${idSala}')">Sim</div>
                                        <div class="btnRecusar" onclick = "recusar('${uid}', '${idSala}')">Não</div>
                                    </div>

                                </div>

                            </div>
                        `;
                    }
                }
            }
        }
    });

      window.permitir = async function(idUsuario, idSala) {
    try {
        // Aprova o integrante
        await update(
            ref(db, `Salas/${idSala}/Integrantes`),
            {
                [idUsuario]: true
            }
        );
        await update(
            ref(db, `Salas/${idSala}/`),{
                n_inscritos: increment(1)
            })
        
        // Apaga a solicitação do usuário
        await remove(
            ref(db, `Usuários/${idUsuario}/Pendentes/${idSala}`)
        );

    } catch (erro) {
        console.error("Erro ao aprovar solicitação:", erro);
        alert("Não foi possível aprovar a solicitação.");
    }
};

window.recusar = async function(idUsuario, idSala){
  //Removendo a solicitação na Sala
    await remove(
      ref(db, `Salas/${idSala}/Integrantes/${idUsuario}`)
    )
    //Removendo a solicitação no usuário
    await remove(
      ref(db, `Usuários/${idUsuario}/Pendentes/${idSala}`)
    )
};
});
