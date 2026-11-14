
import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  ref,
  get,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

onAuthStateChanged(auth, async (usuario) => {

  if (!usuario) {
    window.location.href = "/login";
    return;
  }

  const btnFechar = document.querySelector(".img");

  btnFechar.addEventListener("click", () => {
    window.location.href = "/salas";
  });

  // =====================
  // ID DA SALA
  // =====================

  const idSala = document.getElementById("idSala").innerText;

  console.log(idSala);

  const refSala = ref(db, `Salas/${idSala}`);

  // =====================
  // DADOS DA SALA
  // =====================

  onValue(refSala, (snapshotSala) => {

    const dados = snapshotSala.val();

    if (!dados) return;

    const nomeSala = document.getElementById("nomeSala");
    const categoriaSala = document.getElementById("categoriaSala");

    nomeSala.innerText = dados.nome;
    categoriaSala.innerText = dados.categoria;

  });

  // ==============================
  // LISTAGEM DOS INTEGRANTES
  // ==============================

  const listaIntegrantes = document.getElementById("integrantesLista");

  onValue(refSala, async (snapshotSala) => {

    const sala = snapshotSala.val();

    listaIntegrantes.innerHTML = "";

    if (!sala || !sala.Integrantes) return;

    // VERIFICAR SE É O CRIADOR

    const ehCriador = usuario.uid === sala.criador;

    // PERCORRER INTEGRANTES

    for (let id in sala.Integrantes) {

      const status = sala.Integrantes[id];

      // IGNORAR PENDENTES

      if (status === "pendente") {
        continue;
      }

      // IGNORAR O CRIADOR

      if (id === sala.criador) {
        continue;
      }

      // BUSCAR DADOS DO USUÁRIO

      const refUsuario = ref(db, `Usuários/${id}`);

      const dadosUsuarioInscrito = await get(refUsuario);

      const dadosUsuario = dadosUsuarioInscrito.val();

      if (!dadosUsuario) continue;

      // CRIAR CARD

      const card = document.createElement("div");

      card.classList.add("integrante");

      card.innerHTML = `
        <div class="infoIntegrante">

          <h3>${dadosUsuario.nome}</h3>

          <h4>${dadosUsuario.email}</h4>

        </div>

        <div class="btns">

          <button class="verPerfil">
            <a href="/home/perfil/${id}">Ver perfil</a>
          </button>

          ${ehCriador ? `
            <button
              class="removerPerfil"
              onclick="remover('${id}')"
            >
              Remover da sala
            </button>
          ` : ""}

        </div>
      `;

      listaIntegrantes.appendChild(card);

    }

  });

  // ==============================
  // REMOVER INTEGRANTE
  // ==============================

  window.remover = async function(id) {

    const dadosSala = await get(refSala);

    const sala = dadosSala.val();

    const numero_inscritos = sala.n_inscritos
    if (!sala || sala.criador !== usuario.uid) {
      return;
    }

    const refIntegrante = ref(
      db,
      `Salas/${idSala}/Integrantes/${id}`
    );

    await remove(refIntegrante);

    await update(ref(db, `Salas/${idSala}/`), {
      n_inscritos : numero_inscritos - 1
    })
    console.log("Integrante removido da sala!");

  };

});
