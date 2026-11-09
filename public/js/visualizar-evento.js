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



const iEvento = document.getElementById("i").innerText;


const referencia = ref(db, `Eventos/${String(iEvento)}`);

const evento = await get(referencia);

const dados = evento.val();

// ===============
// Elementos DOM
// ===============

  let nomeEvento = document.getElementById("nomeEvento")
  // let temaEvento = document.getElementById("temaEvento")
  let descricaoEvento = document.getElementById("descricao")
  let limitePessoas = document.getElementById("limitePessoas")
  let data = document.getElementById("data")
  let horarioInicio = document.getElementById("horarioInicio")
  let horarioTermino = document.getElementById("horariotermino")
  let local = document.getElementById("local")
  let criador = document.getElementById("criador")
  
  // ====================
  // INSERINDO OS DADOS
  // ====================


  nomeEvento.innerText = dados.nome;
  descricaoEvento.innerText = dados.descricao;
  limitePessoas.innerText = dados.vagas
  data.innerText = dados.data
  horarioInicio.innerText = dados.horarioInicio
  horarioTermino.innerText = dados.horarioTermino

  local.innerText = dados.local

  criador.innerText = dadosUsuario.nome;

  let inscritosDiv = document.getElementById("inscritos")

  let refEvento = ref(db,`Eventos/${iEvento}/Participantes`);

  let inscrito = false
  // LISTAGEM DOS INSCRITOS //

  onValue(refEvento, async (snapshotInscritos) => {
    inscritosDiv.innerHTML = ""
    let dadosInscritos = snapshotInscritos.val()

    if(!dadosInscritos){
      inscritosDiv.innerText = "Nenhuma inscrição no momento"
      return
    }
    for(let uid in dadosInscritos){

      if(dadosInscritos[uid] === "pendente") continue;
        let refUsuario = ref(db,`Usuários/${uid}`);
        
       let dados = await get(refUsuario)
       let infoInscrito = dados.val()


        inscritosDiv.innerHTML += `
        <div class="inscrito">
        <div class="info-inscrito"> 
        <p>${infoInscrito.nome}</p>
        <p>${infoInscrito.email}</p>
        </div>
        <div class="visualizar-perfil">
        <button><a href="/eventos/visualizar-evento/participante/${uid}">Ver perfil</a></button>
        </div>
        </div>
        `
        
        if(uid === usuario.uid){
          inscrito = true

        }
    }

    if(!inscrito){
      document.getElementById('inscrito').style.display = "block"
    }
  })


  // =======================
  // INSCRIÇÃO
  // =======================

  let btnInscrever = document.getElementById("inscrito")
  const referenciaInscricao = ref(db, `Eventos/${iEvento}/Participantes/${usuario.uid}`)

  btnInscrever.addEventListener("click", async (event) => {
    event.preventDefault()


    await set(referenciaInscricao, true)

    await update(ref(db, `Eventos/${iEvento}`),{
    inscricoes : dados.inscricoes + 1
    }
    )
  })
})