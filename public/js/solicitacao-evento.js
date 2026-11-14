
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

    onValue(ref(db, "Eventos/"), async (snapshotEventos) => {

        lista.innerHTML = "";

        const dadosEventos = snapshotEventos.val();

        if (!dadosEventos) return;

        // Percorre todas os eventos
        for (let idEvento in dadosEventos) {

            const currentEvento = dadosEventos[idEvento];

            // PERCORRER TODOS OS EVENTOS QUE POSSUI O CURRENT USUÁRIO COMO PENDENTE 

            for(let i in currentEvento.Integrantes){
                let currentParticipante = currentEvento.Integrantes[i]

                if(i === usuario.uid && currentParticipante === "pendente"){
                    //PRECISA CONTER:

                    // NOME DO EVENTO
                    // DESCRIÇÃO DO EVENTO
                    // NOME DO CRIADOR
                    // BOTÕES DE SIM E NÃO

                    //

                    // BUSCA DO NOME DO CRIADOR DO EVENTO

                    const refCriador = ref(db, `Usuários/${currentEvento.criador}`)
                    const dadosCriador = await get(refCriador)
                    const criador = dadosCriador.val()

                    lista.innerHTML += 
                    `
                    <div class="solicitacao">

                                <div class="area-superior">

                                    <div class="eventoInfo">
                                        <h3>${currentEvento.nome}</h3>
                                        <h4>Criador do evento: ${criador.nome}</h4>
                                        <p>${currentEvento.descricao}</p>
                                    </div>

                                    <div class="visualizar">
                                        <button
                                            onclick="window.location.href='/eventos/visualizar/${idEvento}'"
                                        >
                                            Ver Evento
                                        </button>
                                    </div>

                                </div>

                                <div class="area-inferior">

                                    <div class="botoesAcao">
                                        <div class="btnPermitir" onclick = "permitir('${idEvento}')">Sim</div>
                                        <div class="btnRecusar" onclick = "recusar('${idEvento}')">Não</div>
                                    </div>

                                </div>

                            </div>
                    `
                }
            }
        
        }
    });
    window.permitir = async function(idEvento) {

        const refEvento = ref(db, `Eventos/${idEvento}/Integrantes/${usuario.uid}`)
        let dadosEventoParticipantes = await get(refEvento)
        let eventoParticipantes = dadosEventoParticipantes.val()


        let inscricoesRef = ref(db, `Eventos/${idEvento}`);
        let dadosinscricoes = await get(inscricoesRef)
        let quantInscritos = dadosinscricoes.val()
        let inscritos = quantInscritos.inscricoes
        // ATUALIZAR PARA TRUE //

        await set(refEvento, true)
        
        await remove(ref(db, `Usuários/${usuario.uid}/PendentesEvento/${idEvento}`))


        await update(ref(db, `Eventos/${idEvento}`), {
    inscricoes: inscritos + 1
});
    
    }

    window.recusar = async function(idEvento){

        const refEvento = ref(db, `Eventos/${idEvento}/Integrantes/${usuario.uid}`)

        await remove(refEvento)
        await remove(ref(db, `Usuários/${usuario.uid}/PendentesEvento/${idEvento}`))

    }
});
