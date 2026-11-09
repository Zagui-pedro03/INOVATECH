
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

  // =========================
  // CONTAINER DOS USUÁRIOS
  // =========================

  const listagem = document.querySelector(".usuarios-container");

  // =========================
  // VERIFICA SE ESTÁ LOGADO
  // =========================

  if (!listagem) {
    console.error("Container de usuários não encontrado.");
    return;
  }

  try {

    // =========================
    // BUSCA OS USUÁRIOS
    // =========================

    const refUsuarios = ref(db, "Usuários/");

    const snapshotUsuarios = await get(refUsuarios);

    listagem.innerHTML = "";

    if (!snapshotUsuarios.exists()) {
      listagem.textContent = "Nenhum usuário encontrado.";
      return;
    }

    // =========================
    // PERCORRE OS USUÁRIOS
    // =========================

    snapshotUsuarios.forEach((usuarioSnapshot) => {

      const usuarioLista = usuarioSnapshot.val();
      const uid = usuarioSnapshot.key;

      if (!usuarioLista) {
        return;
      }

      const nomeUsuario = usuarioLista.nome || "Sem nome";
      const emailUsuario = usuarioLista.email || "Sem e-mail";

      const primeiraLetraUsuario =
        String(nomeUsuario).trim().charAt(0).toUpperCase() || "?";

      // =========================
      // QUALIDADES
      // =========================

      const qualidades = usuarioLista.qualidades;
      let listaQualidades = [];

      if (Array.isArray(qualidades)) {
        listaQualidades = qualidades;

      } else if (qualidades && typeof qualidades === "object") {
        listaQualidades = Object.values(qualidades);

      } else if (qualidades) {
        listaQualidades = [qualidades];
      }

      listaQualidades = listaQualidades
        .filter(Boolean)
        .slice(0, 3);

      // =========================
      // CRIA O CARD COM INNERHTML
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

            ${listaQualidades.length > 0 ? `
              <div class="usuario-qualidades">
                ${listaQualidades.map(qualidade => `
                  <span class="qualidade">
                    ${qualidade}
                  </span>
                `).join("")}
              </div>
            ` : ""}

          </div>

          <a
            class="btn-visualizar"
            href="/home/perfil/${encodeURIComponent(uid)}"
          >
            Visualizar perfil
          </a>

        </div>
      `;

    });

  } catch (erro) {

    console.error("Erro ao buscar usuários:", erro);

    listagem.textContent =
      "Não foi possível carregar os usuários.";

  }

  //=========================
  // PESQUISA DE USUÁRIOS
  //=========================

  const btnPesquisar = document.getElementById("enviarPesquisa");
  let inputPesquisa = document.getElementById("txtPesquisa");

  btnPesquisar.addEventListener("click", async (event) => {
    event.preventDefault();

    let valPesquisa = inputPesquisa.value;

    const snapshot = await get(ref(db, "Usuários"));

    listagem.innerHTML = "";

    const dadosUsuarios = snapshot.val();

    let contador = 0

    for (let i in dadosUsuarios) {

      const currentUsuario = dadosUsuarios[i];
      const uid = i;


       const nomeUsuario = currentUsuario.nome || "Sem nome";
      const emailUsuario = currentUsuario.email || "Sem e-mail";

      const primeiraLetraUsuario =
        String(nomeUsuario).trim().charAt(0).toUpperCase() || "?";
        
      // =========================
      // VERIFICAÇÃO DA PESQUISA
      // =========================

      if(String(currentUsuario.nome).toLowerCase().trim().includes(String(valPesquisa).toLowerCase().trim())){

        contador++

      // =========================
      // QUALIDADES
      // =========================

      const qualidades = currentUsuario.qualidades;
      let listaQualidades = [];

      if (Array.isArray(qualidades)) {
        listaQualidades = qualidades;

      } else if (qualidades && typeof qualidades === "object") {
        listaQualidades = Object.values(qualidades);

      } else if (qualidades) {
        listaQualidades = [qualidades];
      }

      listaQualidades = listaQualidades
        .filter(Boolean)
        .slice(0, 3);

      // =========================
      // CRIA O CARD COM INNERHTML
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

            ${listaQualidades.length > 0 ? `
              <div class="usuario-qualidades">
                ${listaQualidades.map(qualidade => `
                  <span class="qualidade">
                    ${qualidade}
                  </span>
                `).join("")}
              </div>
            ` : ""}

          </div>

          <a
            class="btn-visualizar"
            href="/home/perfil/${encodeURIComponent(uid)}"
          >
            Visualizar perfil
          </a>

        </div>
      `;

      }
    }

    if(contador === 0){
      
      listagem.innerHTML = 
      `
      <h3>Nenhum usuário com esse nome :(</h3>
      `
    }

  });

});
