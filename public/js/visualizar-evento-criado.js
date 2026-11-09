
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
    push,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const sair = document.getElementById('logout');

sair.addEventListener('click', async () => {
    await signOut(auth);

    window.location.href = "/login";
});

onAuthStateChanged(auth, async (usuario) => {

    if (!usuario) {
        window.location.href = "/login";
        return;
    }

    // =========================
    // DADOS DO USUÁRIO LOGADO
    // =========================

    const referenciaUsuario = ref(db, `Usuários/${usuario.uid}`);

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
        nome.innerText = String(dadosUsuario.nome);
    }

    if (email) {
        email.innerText = String(dadosUsuario.email);
    }

    const iEvento = document.getElementById("i").innerText;

    const referencia = ref(db, `Eventos/${String(iEvento)}`);

    const evento = await get(referencia);

    const dados = evento.val();

    // ===============
    // Elementos DOM
    // ===============

    let nomeEvento = document.getElementById("nomeEvento");
    let temaEvento = document.getElementById("temaEvento");
    let descricaoEvento = document.getElementById("descricao");
    let limitePessoas = document.getElementById("limitePessoas");
    let data = document.getElementById("data");
    let horarioInicio = document.getElementById("horarioInicio");
    let horarioTermino = document.getElementById("horariotermino");
    let local = document.getElementById("local");
    let criador = document.getElementById("criador");

    // ====================
    // INSERINDO OS DADOS
    // ====================

    nomeEvento.innerText = dados.nome;
    temaEvento.innerText = dados.tema;
    descricaoEvento.innerText = dados.descricao;
    limitePessoas.innerText = dados.vagas;
    data.innerText = dados.data;
    horarioInicio.innerText = dados.horarioInicio;
    horarioTermino.innerText = dados.horarioTermino;
    local.innerText = dados.local;
    criador.innerText = dadosUsuario.nome;

    let inscritosDiv = document.getElementById("inscritos");

    let refEvento = ref(db, `Eventos/${iEvento}/Participantes`);

    // =========================
    // LISTAGEM DOS INSCRITOS
    // =========================

    onValue(refEvento, async (snapshotInscritos) => {
        let contador = 0
        let dadosInscritos = snapshotInscritos.val();

        if (!dadosInscritos) {
            inscritosDiv.innerText = "Nenhuma inscrição no momento";
            return;
        }
        inscritosDiv.innerHTML = ""
        for (let uid in dadosInscritos) {
            
            if(dadosInscritos[uid] === "pendente") continue;

            contador ++ 
            let refUsuario = ref(db, `Usuários/${uid}`);

            let dados = await get(refUsuario);
            let infoInscrito = dados.val();
            inscritosDiv.innerHTML += `
                <div class="inscrito">
                    <div class="info-inscrito">
                        <p>${infoInscrito.nome}</p>
                        <p>${infoInscrito.email}</p>
                    </div>

                    <div class="visualizar-perfil">
                        <button>
                            <a href="/eventos/visualizar-evento/participante/${uid}">
                                Ver perfil
                            </a>
                        </button>
                    </div>
                </div>
            `;

            
        }
        if(contador === 0) {
                inscritosDiv.innerText = "Nenhuma inscrição no momento";
            }
    });

    // =========================
    // TÉRMINO DA LISTAGEM
    // =========================
    window.editar = function () {
        const btnEnviar = document.getElementById("atualizabtn");
        btnEnviar.style.display = 'block';

        // NOME

        let inputNome = document.createElement('input');
        inputNome.type = "text";
        inputNome.value = nomeEvento.innerText;
        inputNome.id = 'inputNome';
        inputNome.className = 'campo-edicao';

        nomeEvento.replaceWith(inputNome);

        // TEMA

        let selectTema = document.createElement("select");
        selectTema.id = 'selectTema';
        selectTema.className = 'campo-edicao';

        let optionNada = document.createElement('option');
        optionNada.value = 'nada';
        optionNada.innerText = "Selecione um tema";

        selectTema.appendChild(optionNada);

        let optionTecIno = document.createElement('option');
        optionTecIno.value = 'Tecnologia e Inovação';
        optionTecIno.innerText = "Tecnologia e Inovação";

        selectTema.appendChild(optionTecIno);

        let optionEduc = document.createElement("option");
        optionEduc.value = "Educação e Conhecimento";
        optionEduc.innerText = "Educação e Conhecimento";

        selectTema.appendChild(optionEduc);

        let optionCarre = document.createElement("option");
        optionCarre.value = "Carreira e Networking";
        optionCarre.innerText = "Carreira e Networking";

        selectTema.appendChild(optionCarre);

        let optionSocial = document.createElement("option");
        optionSocial.value = "Social";
        optionSocial.innerText = "Social";

        selectTema.appendChild(optionSocial);

        let optionEsports = document.createElement("option");
        optionEsports.value = "Esportes e Atividades Físicas";
        optionEsports.innerText = "Esportes e Atividades Físicas";

        selectTema.appendChild(optionEsports);

        let optionMusic = document.createElement("option");
        optionMusic.value = "Música e Entretenimento";
        optionMusic.innerText = "Música e Entretenimento";

        selectTema.appendChild(optionMusic);

        let optionArte = document.createElement("option");
        optionArte.value = "Arte e Criatividade";
        optionArte.innerText = "Arte e Criatividade";

        selectTema.appendChild(optionArte);

        let optionCommunity = document.createElement("option");
        optionCommunity.value = "Comunidade e Voluntariado";
        optionCommunity.innerText = "Comunidade e Voluntariado";

        selectTema.appendChild(optionCommunity);

        let optionNature = document.createElement("option");
        optionNature.value = "Natureza e Lazer";
        optionNature.innerText = "Natureza e Lazer";

        selectTema.appendChild(optionNature);

        let optionGastronomy = document.createElement("option");
        optionGastronomy.value = "Gastronomia";
        optionGastronomy.innerText = "Gastronomia";

        selectTema.appendChild(optionGastronomy);

        let optionReligion = document.createElement("option");
        optionReligion.value = "Religião e Espiritualidade";
        optionReligion.innerText = "Religião e Espiritualidade";

        selectTema.appendChild(optionReligion);

        let optionComemorative = document.createElement("option");
        optionComemorative.value = "Comemorativo";
        optionComemorative.innerText = "Comemorativo";

        selectTema.appendChild(optionComemorative);

        let optionChampion = document.createElement("option");
        optionChampion.value = "Competições e Torneios";
        optionChampion.innerText = "Competições e Torneios";

        selectTema.appendChild(optionChampion);

        temaEvento.replaceWith(selectTema);

        // DESCRIÇÃO

        let inputDescricao = document.createElement('textarea');
        inputDescricao.value = descricaoEvento.innerText;
        inputDescricao.id = 'inputDescricao';
        inputDescricao.className = 'campo-edicao';

        descricaoEvento.replaceWith(inputDescricao);

        // LIMITE DE PESSOAS

        let definirLimitePessoas = document.createElement('select');
        definirLimitePessoas.id = 'definirLimitePessoas';
        definirLimitePessoas.className = 'campo-edicao';

        let optionDefinir = document.createElement('option');
        optionDefinir.value = "definir";
        optionDefinir.innerText = 'Definir';

        let optionIlimitado = document.createElement('option');
        optionIlimitado.value = "ilimitado";
        optionIlimitado.innerText = 'Ilimitado';

        definirLimitePessoas.appendChild(optionDefinir);
        definirLimitePessoas.appendChild(optionIlimitado);

        limitePessoas.replaceWith(definirLimitePessoas);

        // RECIPIENTE PARA O INPUT OU TEXTO

        let recipiente = document.createElement('div');
        recipiente.id = 'recipienteLimite';

        definirLimitePessoas.after(recipiente);

        function limite() {

            recipiente.innerHTML = '';

            if (definirLimitePessoas.value === 'definir') {

                let inputVagas = document.createElement('input');
                inputVagas.type = 'number';
                inputVagas.id = 'inputVagas';
                inputVagas.className = 'campo-edicao';
                inputVagas.min = '1';
                inputVagas.placeholder = 'Quantidade de pessoas';

                recipiente.appendChild(inputVagas);

            } else {

                let labelIlimitado = document.createElement('p');
                labelIlimitado.innerText = 'Quantidade ilimitada de pessoas';
                labelIlimitado.id = 'labelIlimitado';

                recipiente.appendChild(labelIlimitado);
            }
        }

        definirLimitePessoas.addEventListener('change', limite);

        limite();

        // DATA

        let inputData = document.createElement('input');
        inputData.type = 'date';
        inputData.value = data.innerText;
        inputData.id = 'inputData';
        inputData.className = 'campo-edicao';

        data.replaceWith(inputData);

        // LOCAL

        let inputLocal = document.createElement('input');
        inputLocal.type = 'text';
        inputLocal.value = local.innerText;
        inputLocal.id = 'inputLocal';
        inputLocal.className = 'campo-edicao';

        local.replaceWith(inputLocal);

        // HORÁRIO DE INÍCIO

        let inputHorarioInicio = document.createElement('input');
        inputHorarioInicio.type = 'time';
        inputHorarioInicio.value = horarioInicio.innerText;
        inputHorarioInicio.id = 'inputHorarioInicio';
        inputHorarioInicio.className = 'campo-edicao';

        horarioInicio.replaceWith(inputHorarioInicio);

        // HORÁRIO DE TÉRMINO

        let inputHorarioTermino = document.createElement('input');
        inputHorarioTermino.type = 'time';
        inputHorarioTermino.value = horarioTermino.innerText;
        inputHorarioTermino.id = 'inputHorarioTermino';
        inputHorarioTermino.className = 'campo-edicao';

        horarioTermino.replaceWith(inputHorarioTermino);

        // ADICIONAR USUÁRIOS NA ABA DE INSCRIÇÕES

        const container = document.getElementById("divConvidar")

        let divParticipar = document.createElement('div')
        divParticipar.id = "divParticipar"

        let h3 = document.createElement('h3')
        h3.innerText = "Deseja adicionar alguém?"

        let texto = document.createElement("p")
        texto.innerText = `Clique no botão abaixo`

        let btnProcurar = document.createElement('button')
        btnProcurar.innerText = "+"
        btnProcurar.id = "btnProcurar"
        divParticipar.appendChild(h3)
        divParticipar.appendChild(texto)
        divParticipar.appendChild(btnProcurar)

        container.appendChild(divParticipar)
        
       btnProcurar.addEventListener('click', () => {

    container.removeChild(divParticipar);

    // TEXTO EXPLICATIVO
    let p = document.createElement("p");
    p.innerText = "Escolha uma das opções de busca de usuários:";

    container.appendChild(p);

    // CONTAINER DE BOTÕES DE FILTRO
    let containerBtn = document.createElement("div");
    containerBtn.id = "containerBtn";

    let btnNome = document.createElement("button");
    btnNome.id = "btnNome";
    btnNome.innerText = "Nomes";

    let btnQualidade = document.createElement("button");
    btnQualidade.id = "btnQualidade";
    btnQualidade.innerText = "Qualidades";

    containerBtn.appendChild(btnNome);
    containerBtn.appendChild(btnQualidade);

    container.appendChild(containerBtn);

    // DIV PARA PESQUISA
    let divPesquisa = document.createElement("div");
    divPesquisa.id = "divPesquisa";

    let inputPesquisa = document.createElement("input");
    inputPesquisa.type = "text";
    inputPesquisa.id = "inputPesquisa";
    inputPesquisa.placeholder = "Digite sua pesquisa...";

    let btnPesquisar = document.createElement("button");
    btnPesquisar.type = "button";
    btnPesquisar.id = "btnPesquisar";
    btnPesquisar.innerText = "Pesquisar";

    divPesquisa.appendChild(inputPesquisa);
    divPesquisa.appendChild(btnPesquisar);

    container.appendChild(divPesquisa);

    // LISTA DE USUÁRIOS
    let listaUsuarios = document.createElement("div");
    listaUsuarios.id = "listaUsuarios";

    container.appendChild(listaUsuarios);

    // OCULTAR ATÉ ESCOLHER O FILTRO
    divPesquisa.style.display = "none";
    listaUsuarios.style.display = "none";

    let tipoPesquisa = "";

    // =========================
    // PESQUISAR POR NOME
    // =========================

    btnNome.addEventListener("click", () => {

        tipoPesquisa = "nome";

        divPesquisa.style.display = "flex";
        listaUsuarios.style.display = "block";

        inputPesquisa.placeholder = "Digite o nome do usuário";

        inputPesquisa.value = "";
        listaUsuarios.innerHTML = "";

        inputPesquisa.focus();

    });

    // =========================
    // PESQUISAR POR QUALIDADE
    // =========================

    btnQualidade.addEventListener("click", () => {

        tipoPesquisa = "qualidade";

        divPesquisa.style.display = "flex";
        listaUsuarios.style.display = "block";

        inputPesquisa.placeholder = "Digite a qualidade desejada";

        inputPesquisa.value = "";
        listaUsuarios.innerHTML = "";

        inputPesquisa.focus();

    });

    // =========================
    // PESQUISAR USUÁRIOS
    // =========================

    btnPesquisar.addEventListener("click", async () => {

        listaUsuarios.innerHTML = "";

        let pesquisa = inputPesquisa.value.trim();

        if (pesquisa === "") {
            listaUsuarios.innerHTML = `<p>Escreva algo para buscar</p>`;
            return;
        }

        const refUsuarios = ref(db, "Usuários");

        let getUsuarios = await get(refUsuarios);

        let usuarios = getUsuarios.val();

        if (!usuarios) {
            listaUsuarios.innerHTML = `<p>Nenhum usuário encontrado.</p>`;
            return;
        }

        // =========================
        // LISTAGEM DOS USUÁRIOS
        // =========================

        for (let i in usuarios) {

            let currentUsuario = usuarios[i];

            // NÃO LISTAR O PRÓPRIO USUÁRIO
            if (i === usuario.uid) {
                continue;
            }
            // =========================
            // VERIFICAR SOLICITAÇÃO
            // =========================

            let referenciaPendente = ref(
                db,
                `Eventos/${iEvento}/Participantes/${i}`
            );

            let snapshotPendente = await get(referenciaPendente);

            let jaSolicitado = snapshotPendente.exists();

            // =========================
            // VERIFICAR PESQUISA
            // =========================

            let encontrou = false;

            if (tipoPesquisa === "nome") {

                encontrou = currentUsuario.nome
                    ?.toLowerCase()
                    .includes(pesquisa.toLowerCase());

            }

            if (tipoPesquisa === "qualidade") {

                for (let j in currentUsuario.qualidades || {}) {

                    let currentQualidade = currentUsuario.qualidades[j];

                    if (
                        String(currentQualidade)
                            .toLowerCase()
                            .includes(pesquisa.toLowerCase())
                    ) {
                        encontrou = true;
                        break;
                    }

                }

            }

            if (!encontrou) {
                continue;
            }

            // =========================
            // LISTAR USUÁRIO
            // =========================

            listaUsuarios.innerHTML += `

                <div class="cardUsuario">

                    <div class="infoUsuario">

                        <h4>${currentUsuario.nome || "Sem nome"}</h4>

                        <p>${currentUsuario.email || ""}</p>

                        ${
                            tipoPesquisa === "qualidade"
                            ? `
                                <div class="qualidades">
                                    ${Object.values(currentUsuario.qualidades || {}).map(qualidade => `
                                        <span>${qualidade}</span>
                                    `).join("")}
                                </div>
                            `
                            : ""
                        }

                    </div>

                    <button
                        type="button"
                        class="btnAdicionar"
                        data-uid="${i}"
                        onclick="solicitar('${i}',this)"
                        ${jaSolicitado ? "disabled" : ""}
                    >
                        ${jaSolicitado ? "Pendente" : "Adicionar"}
                    </button>

                </div>

            `;

        }

        if (listaUsuarios.innerHTML === "") {
            listaUsuarios.innerHTML = `<p>Nenhum usuário encontrado.</p>`;
        }

    });

    // =========================
    // SOLICITAR PARTICIPAÇÃO
    // =========================

    window.solicitar = async function(i, btn) {

        try {

            // =========================
            // VERIFICAR SOLICITAÇÃO
            // =========================

            let referenciaPendente = ref(
                db,
                `Usuários/${i}/PendentesEvento/${iEvento}`
            );

            let dadosPendente = await get(referenciaPendente);

            if (dadosPendente.exists()) {

                btn.innerText = "Pendente";
                btn.disabled = true;

                return;
            }

            // =========================
            // ENVIAR SOLICITAÇÃO
            // =========================

            await update(
                ref(db, `Usuários/${i}/PendentesEvento`),
                {
                    [iEvento]: "pendente"
                }
            );

            await set(
                ref(db, `Eventos/${iEvento}/Participantes/${i}`),
                "pendente"
            );

            // =========================
            // ATUALIZAR BOTÃO
            // =========================

            btn.innerText = "Pendente";
            btn.disabled = true;

            alert("Pedido enviado!");

        } catch (erro) {

            console.error("Erro ao enviar solicitação:", erro);

            alert("Não foi possível enviar o pedido.");

        }

    };

});
        // =========================
        // ENVIAR E ATUALIZAR EVENTO
        // =========================

        btnEnviar.addEventListener('click', async () => {

            const resposta = await fetch("/eventos/visualizar-evento/editar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: inputNome.value,
                    tema: selectTema.value,
                    descricao: inputDescricao.value,
                    vagas: definirLimitePessoas.value === "ilimitado"
                        ? "ilimitado"
                        : Number(document.getElementById("inputVagas").value),
                    data: inputData.value,
                    local: inputLocal.value,
                    horarioInicio: inputHorarioInicio.value,
                    horarioTermino: inputHorarioTermino.value
                })
            });

            let dados = await resposta.json();

            const inputVagas = document.getElementById("inputVagas");

            validarCampo(
                inputNome,
                document.getElementById("txtNome"),
                dados.errorNome,
                "Nome válido"
            );
            validarCampo(
                selectTema,
                document.getElementById("txtTema"),
                dados.errorTema,
                "Tema válido"
            );

            validarCampo(
                inputDescricao,
                document.getElementById("txtDescricao"),
                dados.errorDescricao,
                "Descrição válida"
            );

            validarCampo(
                definirLimitePessoas.value === "ilimitado"
                    ? definirLimitePessoas
                    : inputVagas,
                document.getElementById("txtVagas"),
                dados.errorVagas,
                "Limite de pessoas válido"
            );

            validarCampo(
                inputData,
                document.getElementById("txtData"),
                dados.errorData,
                "Data válida"
            );

            validarCampo(
                inputLocal,
                document.getElementById("txtLocal"),
                dados.errorLocal,
                "Local válido"
            );

            validarCampo(
                inputHorarioInicio,
                document.getElementById("txtHorarioInicio"),
                dados.errorHorarioInicio,
                "Horário de início válido"
            );

            validarCampo(
                inputHorarioTermino,
                document.getElementById("txtHorarioTermino"),
                dados.errorHorarioTermino,
                "Horário de término válido"
            );

            // Se o servidor encontrou erros, interrompe a atualização.

            if (!resposta.ok) {
                return;
            }

            update(ref(db, `Eventos/${iEvento}`), {
                nome: inputNome.value,
                descricao: inputDescricao.value,
                tema: selectTema.value,
                vagas: definirLimitePessoas.value === "ilimitado"
                    ? "ilimitado"
                    : Number(inputVagas.value),
                data: inputData.value,
                local: inputLocal.value,
                horarioInicio: inputHorarioInicio.value,
                horarioTermino: inputHorarioTermino.value
            });

         

            window.location.reload();
        });
    };

    // =========================
    // VALIDAR CAMPO
    // =========================

    function validarCampo(campo, mensagem, erro, textoValido) {

        campo.classList.remove("correto", "errado");
        mensagem.classList.remove("erro", "sucesso");

        if (erro) {
            mensagem.innerText = erro;
            mensagem.classList.add("erro");
            campo.classList.add("errado");

        } else {
            mensagem.innerText = textoValido;
            mensagem.classList.add("sucesso");
            campo.classList.add("correto");
        }

        mensagem.style.display = "block";
    }

    // =========================
    // DELETAR EVENTO
    // =========================

    window.deletar = async function () {

        if (confirm("Deseja excluir este evento?")) {

            await remove(ref(db, `Eventos/${iEvento}`));

            alert("Evento excluído com sucesso!");

            window.location.href = "/home/perfil";
        }
    };

    

});
