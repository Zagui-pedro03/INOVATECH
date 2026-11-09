import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    ref,
    get,
    onValue,
    set
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const sair = document.getElementById('logout')

  sair.addEventListener('click', async () => {
    await signOut(auth)

    window.location.href = "/login"
  })

onAuthStateChanged(auth, async (usuario) => {

    if (!usuario) {
        window.location.href = "/login";
        return;
    } else { 

    const registro = ref(db,`Usuários/${usuario.uid}`);
    const snapshotUsuario = await get(registro);
    const currentUsuario = snapshotUsuario.val();

    let nome = currentUsuario.nome;
    let email = currentUsuario.email;

    document.getElementById("nome").innerText = `${nome}`
    document.getElementById("email").innerText = `${email}`

    document.getElementById("primeira-letra").innerText = `${String(nome[0]).toUpperCase()}`



    // PESQUISA DOS EVENTOS //

    const referenciaEventos = ref(db,"Eventos/");
    const pesquisar = document.getElementById("imgPesquisar");
    const pesquisa = document.getElementById("pesquisaEvento");
    const listaEvento = document.querySelector(".eventos-container")

    pesquisar.addEventListener('click', async (event) => {
        event.preventDefault();

       
  onValue(referenciaEventos, (snapshotEvento) => {

    let EventDados = snapshotEvento.val()

    for(let event in EventDados){
        let dadosEvento = EventDados[event]


        if(String(pesquisa.value) === String(dadosEvento.nome)){

             // INSCRIÇÃO //

        window.inscrever = async function (eventId, botao) {
  try {
    const referenciaEvento = ref(db, `Eventos/${eventId}`);
    const snapshotEvento = await get(referenciaEvento);

    if (!snapshotEvento.exists()) {
      alert("Evento não encontrado.");
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

    if (snapshotInscricao.exists()) {
      botao.innerText = "Inscrito";
      botao.disabled = true;
      return;
    }

    if (
      vagas !== "ilimitado" &&
      quantidade >= Number(vagas)
    ) {
      alert("Não há vagas disponíveis.");
      return;
    }

    await set(refInscricao, true);

    if( vagas === 'ilimitado'){
    await update(referenciaEvento, {
      inscricoes: quantidade + 1
    });
    }

    botao.innerText = "Inscrito";
    botao.disabled = true;

   

  } catch (erro) {
    console.error("Erro ao realizar inscrição:", erro);
  }
};



  
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


  // LISTAGEM //

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
              <h4 style="color: gray; font-weight: 500;">${dadosEvento.tema}</h4>
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
                ${inscrito ? "disabled" : ""}
              >
                ${inscrito
                  ? "Inscrito"
                  : "Inscrever-se"}
              </button>
              <button id= "btnVisualizar"><a href="eventos/visualizar/${event}">Visualizar</a></button>

              <button class="btn-expandir">

                Ver mais

                <span class="seta">
                  <img src="/assets/img/down-arrow_visualizar.png" width="25">
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
                Descrição
              </h3>

              <p class="data">
                ${dadosEvento.data || ""}
              </p>
              <hr>

              <button class="btn-recolher">

                Recolher

                <span class="seta">
                  <img src="/assets/img/down-arrow_visualizar.png" width="25">
                </span>

              </button>

            </div>

          </div>

        `;

        }
    }

    
  })
    

    })
}
})
