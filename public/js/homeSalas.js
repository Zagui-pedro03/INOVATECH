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
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

// =====================
// LOGOUT
// =====================

const sair = document.getElementById("logout");

sair.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "/login";
});

// =====================
// PERFIL
// =====================

const perfil = document.getElementById("perfil");

perfil.addEventListener("click", () => {
    window.location.href = "/home/perfil";
});

// =====================
// AUTENTICAÇÃO
// =====================

onAuthStateChanged(auth, async (usuario) => {

    if (!usuario) {
        window.location.href = "/login";
        return;
    }

    const currentUsuario = usuario.uid;

    // =====================
    // DADOS DO USUÁRIO
    // =====================

    const referenciaUsuario = ref(
        db,
        `Usuários/${currentUsuario}`
    );

    const snapshotUsuario = await get(referenciaUsuario);
    const dadosUsuario = snapshotUsuario.val();

    if (!dadosUsuario) {
        console.error("Usuário não encontrado!");
        return;
    }

    const nome = dadosUsuario.nome;
    const email = dadosUsuario.email;

    document.getElementById("nome").innerText = nome;
    document.getElementById("email").innerText = email;

    document.getElementById("primeira-letra").innerText =
        String(nome[0]).toUpperCase();

    // =====================
    // REFERÊNCIAS DAS SALAS
    // =====================

    const lista = document.getElementById("salas-container");
    const referencia = ref(db, "Salas");

    // =====================
    // FUNÇÃO INSCREVER
    // =====================

    window.inscrever = async function (sala, btn) {

        btn.disabled = true;

        try {

            const refSala = ref(db, `Salas/${sala}`);
            const snapshotSala = await get(refSala);
            const dados = snapshotSala.val();

            if (!dados) {
                alert("Sala não encontrada!");
                return;
            }

            // =====================
            // VERIFICAR INSCRIÇÃO
            // =====================

            const refUsuario = ref(
                db,
                `Salas/${sala}/Integrantes/${currentUsuario}`
            );

            const snapshotIntegrante = await get(refUsuario);
            const statusUsuario = snapshotIntegrante.val();

            // =====================
            // USUÁRIO JÁ INSCRITO
            // =====================

            if (statusUsuario === true) {

                window.location.href =
                    `salas/sala-geral/${sala}`;

                return;
            }

            // =====================
            // SOLICITAÇÃO PENDENTE
            // =====================

            if (statusUsuario === "pendente") {

                btn.innerText = "Pendente";

                alert(
                    "Sua solicitação de entrada ainda está pendente!"
                );

                return;
            }

            // =====================
            // SALA PÚBLICA
            // =====================

            if (dados.privacidade === "pública") {

                // Registrar participante
                const resultado = await runTransaction(
                    refUsuario,
                    (statusAtual) => {
                        if (statusAtual === null) {
                            return true;
                        }

                        return;
                    }
                );

                if (resultado.committed) {

                    // Atualizar contador
                    await runTransaction(
                        ref(db, `Salas/${sala}/n_inscritos`),
                        (quantidadeAtual) => {
                            return (Number(quantidadeAtual) || 0) + 1;
                        }
                    );

                }

                btn.innerText = "Inscrito";

            } else {

                // =====================
                // SALA PRIVADA
                // =====================

                const resultado = await runTransaction(
                    refUsuario,
                    (statusAtual) => {
                        if (statusAtual === null) {
                            return "pendente";
                        }

                        return;
                    }
                );

                if (resultado.committed) {

                    await set(
                        ref(
                            db,
                            `Usuários/${currentUsuario}/Pendentes/${sala}`
                        ),
                        true
                    );

                }

                btn.innerText = "Pendente";
            }

        } catch (erro) {

            console.error("Erro ao realizar inscrição:", erro);

            alert("Não foi possível realizar a inscrição.");

        } finally {

            btn.disabled = false;
        }
    };

    // =====================
    // LISTAR SALAS
    // =====================

    onValue(referencia, (snapshotSalas) => {

        let contador = 0;

        lista.innerHTML = "";

        const dados = snapshotSalas.val();

        for (let i in dados) {

            const currentDados = dados[i];

            if(currentDados.codigo_evento){
                continue;
            }

            contador++;

            // =====================
            // VERIFICAR STATUS
            // =====================
            
            const statusUsuario =
                currentDados.Integrantes?.[currentUsuario];

            let textoBotao = "Inscrever-se";

            // Usuário inscrito
            if (statusUsuario === true) {

                textoBotao = "Entrar na sala";

            }

            // Solicitação pendente
            else if (statusUsuario === "pendente") {

                textoBotao = "Pendente";

            }

            // =====================
            // CRIAR CARD DA SALA
            // =====================

            lista.innerHTML += `
                <div class="sala">

                    <div class="area-superior">

                        <div class="titulo-tema">
                            <h3>${currentDados.nome || "Sem nome"}</h3>
                            <h4>${currentDados.categoria || "Sem categoria"}</h4>
                        </div>

                        <div class="descricao">
                            <p>${currentDados.descricao || "Sem descrição"}</p>
                        </div>

                        <div class="inscritos">
                            <p>
                                ${currentDados.n_inscritos || 0}
                                participantes
                            </p>
                        </div>

                    </div>

                    <div class="area-inferior">

                        <div id="opcoes">

                            <button
                                class="btn-inscrever"
                                onclick="inscrever('${i}', this)"
                            >
                                ${textoBotao}
                            </button>

                        </div>

                        <div class="privacidade">
                            <p class="privacidade-texto">
                                ${currentDados.privacidade || "Não informada"}
                            </p>
                        </div>

                    </div>

                </div>
            `;
        }
        if(contador === 0){
            document.getElementById("semEventos").style.display = "block"
        }

    }, (erro) => {
        console.error("Erro ao carregar salas:", erro);

        
    });

    // ==========================
    // PESQUISAR SALA
    // ==========================

    const btnPesquisar = document.getElementById("enviarPesquisa")

    btnPesquisar.addEventListener("click", async (event) => {
        event.preventDefault()


        document.getElementById("semEventos").style.display = "none"

        lista.innerHTML = ""

        let contador = 0;

        // PEGANDO OS DADOS DO NÓ SALAS //
        const refSala = ref(db, "Salas")
        const DadosSala = await get(refSala)
        const salas = DadosSala.val()

        // PEGANDO O QUE O USUÁRIO DIGITOU //

        let inputPesquisa = document.getElementById("txtPesquisa")

        for(let i in salas){
            let currentDados = salas[i]

            if(currentDados.codigo_evento){
                continue;
            }

            if(String(currentDados.nome).toLowerCase().includes(String(inputPesquisa.value).toLowerCase())){
                
                contador++

                const statusUsuario =
                currentDados.Integrantes?.[currentUsuario];

            let textoBotao = "Inscrever-se";

            // Usuário inscrito
            if (statusUsuario === true) {

                textoBotao = "Entrar na sala";

            }

            // Solicitação pendente
            else if (statusUsuario === "pendente") {

                textoBotao = "Pendente";

            }


                    lista.innerHTML += `
                <div class="sala">

                    <div class="area-superior">

                        <div class="titulo-tema">
                            <h3>${currentDados.nome || "Sem nome"}</h3>
                            <h4>${currentDados.categoria || "Sem categoria"}</h4>
                        </div>

                        <div class="descricao">
                            <p>${currentDados.descricao || "Sem descrição"}</p>
                        </div>

                        <div class="inscritos">
                            <p>
                                ${currentDados.n_inscritos || 0}
                                participantes
                            </p>
                        </div>

                    </div>

                    <div class="area-inferior">

                        <div id="opcoes">

                            <button
                                class="btn-inscrever"
                                onclick="inscrever('${i}', this)"
                            >
                                ${textoBotao}
                            </button>

                        </div>

                        <div class="privacidade">
                            <p class="privacidade-texto">
                                ${currentDados.privacidade || "Não informada"}
                            </p>
                        </div>

                    </div>

                </div>
            `;

            }
        }
        if(contador === 0) {
            lista.innerHTML = "<h3>Não há nenhuma sala com este nome :(</h3>"
        }
    })

});