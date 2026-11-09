
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


  const sair = document.getElementById('logout')

  sair.addEventListener('click', async () => {
    await signOut(auth)

    window.location.href = "/login"
  })

  const perfil = document.getElementById('perfil');

  perfil.addEventListener('click', () => {
      window.location.href = "/home/perfil"
  })

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



  // =========================
  // CONTAINER DOS EVENTOS
  // =========================

  const listaEvento = document.querySelector(".eventos-container");



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

        let contador = 0

        listaEvento.innerHTML = "<h1>Eventos</h1>";
  
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
  
          contador ++;
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

        if(contador > 5){
          listaEvento.innerHTML = `
          <a id="maisEventos" href="/eventos">Ver mais eventos</a>
          `

          
        }
      });



  // =========================
  // LISTAGEM DE USUÁRIOS
  // =========================

  const refUsuario =
    ref(db, "Usuários/");

onValue(refUsuario,  async (allDados) => {

  

  const dados =
    allDados.val();


  const listagem =
    document.querySelector(
      ".usuarios-container"
    );


  if (!listagem) {
    return;
  }

  listagem.innerHTML = "<h1>Usuários</h1>"

  if (!dados) {

    listagem.innerHTML = `
      <p class="nenhum-usuario">
        Nenhum usuário encontrado.
      </p>
    `;

    return;

  }



  // =========================
  // PERCORRE USUÁRIOS
  // =========================
  let contadorUsuario = 0
  for (let i in dados) {
    contadorUsuario++
    if(contadorUsuario > 5){
      return;
    }
    const usuarioLista =
      dados[i];


    // Ignora registros inválidos

    if (!usuarioLista) {
      continue;
    }


    const nomeUsuario =
      usuarioLista.nome || "Sem nome";


    const emailUsuario =
      usuarioLista.email || "Sem email";


    // =========================
    // PRIMEIRA LETRA
    // =========================

    const primeiraLetraUsuario =
      String(nomeUsuario[0])
        .toUpperCase();



    // =========================
    // QUALIDADES
    // =========================

    let qualidadesHTML = "";

    const qualidades =
      usuarioLista.qualidades;


    if (qualidades) {


      // Caso seja um array

      if (Array.isArray(qualidades)) {

        qualidadesHTML = qualidades
          .filter(Boolean)
          .slice(0, 3)
          .map((qualidade) => `
            <span class="qualidade">
              ${qualidade}
            </span>
          `)
          .join("");

      }


      // Caso seja um objeto no Firebase

      else if (
        typeof qualidades === "object"
      ) {

        qualidadesHTML = Object.values(
          qualidades
        )
          .filter(Boolean)
          .slice(0, 3)
          .map((qualidade) => `
            <span class="qualidade">
              ${qualidade}
            </span>
          `)
          .join("");

      }


      // Caso seja apenas uma string

      else {

        qualidadesHTML = `
          <span class="qualidade">
            ${qualidades}
          </span>
        `;

      }

    }



    // =========================
    // CARD DO USUÁRIO
    // =========================
    listagem.innerHTML += `

      <div class="usuario-card">


        <div class="usuario-avatar">
          ${primeiraLetraUsuario}
        </div>


        <div class="usuario-info">


          <h2 class="usuario-nome">
            ${nomeUsuario}
          </h2>


          <p class="usuario-email">
            ${emailUsuario}
          </p>


          ${
            qualidadesHTML
              ? `
                <div class="usuario-qualidades">

                  ${qualidadesHTML}

                </div>
              `
              : ""
          }


        </div>


        <a
  href="/home/perfil?uid=${encodeURIComponent(i)}"
  class="btn-visualizar"
>
  Visualizar perfil
</a>


      </div>

    `;
    if(contadorUsuario >= 5){
    listagem.innerHTML +=
    `
    <a href="usuarios/" id= "maisUsuarios">Ver mais usuários</a>
    `
  }
  }

  })

});
