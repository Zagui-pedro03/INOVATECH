
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
  update
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// =========================
// LOGOUT
// =========================

const sair = document.getElementById("logout");

sair.addEventListener("click", async () => {
  await signOut(auth);

  window.location.href = "/login";
});


// =========================
// PERFIL
// =========================

const perfil = document.getElementById("perfil");

perfil.addEventListener("click", () => {
  window.location.href = "/home/perfil";
});


// =========================
// VERIFICAR SE EXISTEM EVENTOS
// =========================
const listaEvento = document.getElementById("eventos-container");




// =========================
// AUTENTICAÇÃO DO USUÁRIO
// =========================

onAuthStateChanged(auth, async (usuario) => {

  if (!usuario) {
    window.location.href = "/login";
    return;
  }


  // =========================
  // DADOS DO USUÁRIO LOGADO
  // =========================

  const referenciaUsuario = ref(
    db,
    `Usuários/${usuario.uid}`
  );

  const snapshotUsuario = await get(referenciaUsuario);

  const dadosUsuario = snapshotUsuario.val();

  const nome = dadosUsuario.nome;
  const email = dadosUsuario.email;

  document.getElementById("nome").innerText = nome;
  document.getElementById("email").innerText = email;

  document.getElementById("primeira-letra").innerText =
    `${String(dadosUsuario.nome[0]).toUpperCase()}`;


  // =========================
  // CONTAINER DOS EVENTOS
  // =========================

  


  // =========================
  // FUNÇÃO DE INSCRIÇÃO
  // =========================

  window.inscrever = async function (eventId, botao) {
    try {
      const referenciaEvento = ref(db, `Eventos/${eventId}`);
      const snapshotEvento = await get(referenciaEvento);

      if (!snapshotEvento.exists()) {
        return;
      }

      const evento = snapshotEvento.val();

      const vagas = evento.vagas;
      const quantidade = Number(evento.inscricoes || 0);

      const refInscricao = ref(
        db,
        `Eventos/${eventId}/Participantes/${usuario.uid}`
      );

      const snapshotInscricao = await get(refInscricao);

      // Se já estiver inscrito, permite entrar na sala
      if (snapshotInscricao.exists()) {
        window.location.href = `/salas/sala-geral/${evento.codigo_sala}`;
        return;
      }

      // Verifica se ainda existem vagas
      if (
        vagas !== "ilimitado" &&
        quantidade >= Number(vagas)
      ) {
        return;
      }

      // Registra a inscrição
      await set(refInscricao, true);

      await update(referenciaEvento, {
        inscricoes: quantidade + 1
      });

      // Entra na sala após a inscrição
      window.location.href = `/salas/sala-geral/${eventId}`;

    } catch (erro) {
      console.error("Erro ao realizar inscrição:", erro);
      alert("Erro ao realizar inscrição.");
    }
  };

  // =======================
  // FUNÇÃO VISUALIZAR
  // =======================

  window.visualizar = async function(sala){
    const refEvento = ref(db, `Eventos/${sala}`)
    let dadosEvento = await get(refEvento)
    let dados = dadosEvento.val()

    if(dados.criador === usuario.uid){
      window.location.href = `/eventos/visualizar-evento/${sala}`
    }
    else{
      window.location.href = `/eventos/visualizar/${sala}`
    }
  }
  // =========================
  // BOTÕES DOS CARDS
  // =========================

  listaEvento.addEventListener("click", (event) => {

    // =========================
    // VER MAIS / RECOLHER
    // =========================

    const botaoExpandir =
      event.target.closest(".btn-expandir");

    if (botaoExpandir) {

      const card =
        botaoExpandir.closest(".evento");

      // Verifica se o card já está expandido
      const estavaExpandido =
        card.classList.contains("expandido");

      // Fecha os outros cards
      document
        .querySelectorAll(".evento.expandido")
        .forEach((outroCard) => {
          outroCard.classList.remove("expandido");
        });

      // Se estava fechado, expande
      // Se estava aberto, mantém fechado
      if (!estavaExpandido) {
        card.classList.add("expandido");
      }

      return;
    }


    // =========================
    // BOTÃO RECOLHER
    // =========================

    const botaoRecolher =
      event.target.closest(".btn-recolher");

    if (botaoRecolher) {

      const card =
        botaoRecolher.closest(".evento");

      card.classList.remove("expandido");

      return;
    }

  });


  
  // =========================
  // EVENTOS DO FIREBASE
  // =========================

  onValue(ref(db, "Eventos/"), (allDados) => {

      listaEvento.innerHTML = "";

      const dadosEventos = allDados.val();

      // Se não existir nenhum evento no Firebase
      if (!dadosEventos) {
        document.getElementById("semEventos").style.display = "block"
        return;
      }


      // =========================
      // CRIA OS CARDS
      // =========================

      for (const event in dadosEventos) {

        const dadosEvento = dadosEventos[event];

        if (!dadosEvento || !dadosEvento.nome) {
          continue;
        }


        // =========================
        // VERIFICA INSCRIÇÃO
        // =========================

        const inscrito =
          dadosEvento.Participantes &&
          dadosEvento.Participantes[usuario.uid];


        listaEvento.innerHTML += `

          <div class="evento">

            <div class="evento-header">

              <div class="titulo-tema">

                <h2 class="evento-titulo">
                  ${dadosEvento.nome || ""}
                </h2>

                <h4 style="color: gray; font-weight: 500;">
                  ${dadosEvento.tema || ""}
                </h4>

              </div>

              <div id="inscricoesInfo">

                <span class="evento-pessoas inscritostxt">
                  inscritos: ${dadosEvento.inscricoes || "nenhum"}
                </span><br>

                <span class="evento-pessoas">
                  Limite de inscrições: ${dadosEvento.vagas || "ilimitado"}
                </span>

              </div>

            </div>


            <div class="evento-acoes">

              <button
                class="btn-inscrever"
                onclick="inscrever('${event}', this)"
              >
                ${inscrito ? "Entrar na Sala" : "Inscrever-se"}
              </button>

              <button id="btnVisualizar" onclick="visualizar('${event}')">
                  Visualizar
              </button>

              <button class="btn-expandir">

                Ver mais

                <span class="seta">
                  <img
                    src="/assets/img/down-arrow_visualizar.png"
                    width="25"
                  >
                </span>

              </button>

            </div>


            <div class="evento-descricao">

              <h3>
                Descrição
              </h3>

              <p class="descricao">
                ${dadosEvento.descricao || ""}
              </p>

              <hr>

              <h3>
                Local
              </h3>

              <p class="local">
                ${dadosEvento.local || ""}
              </p>

              <hr>

              <h3>
                Data
              </h3>

              <p class="data">
                ${dadosEvento.data || ""}
              </p>

              <hr>

              <button class="btn-recolher">

                Recolher

                <span class="seta">
                  <img
                    src="/assets/img/down-arrow_visualizar.png"
                    width="25"
                  >
                </span>

              </button>

            </div>

          </div>

        `;

      }

    },
    (erro) => {
      console.error("Erro ao carregar eventos:", erro);
    });


    // ================================
    // ÁREA DA PESQUISA
    // ================================

    let inputPesquisa = document.getElementById("txtPesquisa");
    const btnPesquisar = document.getElementById("enviarPesquisa");

    btnPesquisar.addEventListener("click", async (event) => {
      
      event.preventDefault()

      listaEvento.innerHTML = ""
      let valPesquisa = inputPesquisa.value

      // CRIAÇÃO DO CONTADOR PARA VERIFICAR SE EXISTE UM EVENTO COM O NOME PESQUISADO //
      let contador = 0;

      // PEGANDO OS DADOS DO NÓ DE EVENTOS NO FIREBASE //

      let dadosEventos = await get(ref(db,"Eventos"))
      let eventos = dadosEventos.val()

     // PERCORRENDO TODOS OS EVENTOS DO NÓ DE EVENTOS DO FIREBASE //

      for(let i in eventos){
        let currentEvento = eventos[i];

    // VERIFICANDO SE O NOME DO EVENTO CONTÉM O TEXTO INSERIDO NA CAIXA DE TEXTO DE PESQUISA //

        if(String(currentEvento.nome).toLocaleLowerCase().includes(String(valPesquisa).toLowerCase())){

          contador++

          const inscrito =
          currentEvento.Participantes &&
          currentEvento.Participantes[usuario.uid];
          
          // LISTAGEM DOS EVENTOS QUE POSSUEM O TEXTO DA CAIXA DE PESQUISA //
          listaEvento.innerHTML += `

          <div class="evento">

            <div class="evento-header">

              <div class="titulo-tema">

                <h2 class="evento-titulo">
                  ${currentEvento.nome || ""}
                </h2>

                <h4 style="color: gray; font-weight: 500;">
                  ${currentEvento.tema || ""}
                </h4>

              </div>

              <div id="inscricoesInfo">

                <span class="evento-pessoas inscritostxt">
                  inscritos: ${currentEvento.inscricoes || "nenhum"}
                </span><br>

                <span class="evento-pessoas">
                  Limite de inscrições: ${currentEvento.vagas || "ilimitado"}
                </span>

              </div>

            </div>


            <div class="evento-acoes">

              <button
                class="btn-inscrever"
                onclick="inscrever('${i}', this)"
              >
                ${inscrito ? "Entrar na Sala" : "Inscrever-se"}
              </button>

              <button id="btnVisualizar" onclick="visualizar('${i}')">
                  Visualizar
              </button>

              <button class="btn-expandir">

                Ver mais

                <span class="seta">
                  <img
                    src="/assets/img/down-arrow_visualizar.png"
                    width="25"
                  >
                </span>

              </button>

            </div>


            <div class="evento-descricao">

              <h3>
                Descrição
              </h3>

              <p class="descricao">
                ${currentEvento.descricao || ""}
              </p>

              <hr>

              <h3>
                Local
              </h3>

              <p class="local">
                ${currentEvento.local || ""}
              </p>

              <hr>

              <h3>
                Data
              </h3>

              <p class="data">
                ${currentEvento.data || ""}
              </p>

              <hr>

              <button class="btn-recolher">

                Recolher

                <span class="seta">
                  <img
                    src="/assets/img/down-arrow_visualizar.png"
                    width="25"
                  >
                </span>

              </button>

            </div>

          </div>

        `;
        }
      }
      if(contador === 0){
        listaEvento.innerText = "Nenhum evento encontrado com esse nome :("
      }
    })
});
