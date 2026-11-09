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
  push,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

onAuthStateChanged(auth, async (usuario) => {

  if (!usuario) {
    window.location.href = "/login";
    return;
  }

  const btnFechar = document.querySelector(".img")

  btnFechar.addEventListener("click", () => {
    window.location.href = "/salas"
  })
  // =====================
  // ID DA SALA
  // =====================

  const idSala = document.getElementById("idSala").innerText;
  console.log(idSala)



  onValue(ref(db, `Salas/${idSala}`), (snapshotSala) => {
    let dados = snapshotSala.val();
   
        let nomeSala = document.getElementById("nomeSala")
        let categoriaSala = document.getElementById("categoriaSala")

        nomeSala.innerText = `${dados.nome}`
        categoriaSala.innerText = dados.categoria
    
  })
  // ENVIAR MENSAGEM //

  const enviarMsg = document.getElementById("enviarMsg");

  enviarMsg.addEventListener("click", async (event) => {
    event.preventDefault()

    let mensagem = document.getElementById("msg")
    let valorMsg = String(mensagem.value).trim();

    if(valorMsg === ""){
      mensagem.classList.add('erro');
      return
    }

    const referencia = ref(db, `Salas/${idSala}/Geral`)

    await push(referencia, {
      mensagem : valorMsg,
      criador : usuario.uid,
      dataHora : serverTimestamp()
    })
    mensagem.value = "";
    location.reload()
  })

  //Listagem das mensagens//

const visorMsg = document.querySelector(".visor-mensagens")

  onValue(ref(db, `Salas/${idSala}/Geral`), async (snapshotMsg) => {
    visorMsg.innerHTML = ``
    let dados = snapshotMsg.val()

    for(let i in dados){
      let currentDados = dados[i]

      let referenciaUsuario = ref(db, `Usuários/${currentDados.criador}`)
      let dadosUsuario = await get(referenciaUsuario)
      let usuarioinfo = dadosUsuario.val()

      let data = new Date(currentDados.dataHora)

            let dataFormatada = data.toLocaleDateString("pt-BR");
            let horaFormatada = data.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit"
            });
      
      if(currentDados.criador === usuario.uid){
          visorMsg.innerHTML += 
      `
      <div class="container-self">
      <div class="mensagem-self">
        <div class="autor">
            <h3 class="autor"><a href="/home/perfil/${currentDados.criador}">${usuarioinfo.nome}</a></h3>
            <div class="linha"></div>
        </div>
        <div class="msg">
            <p class="mensagem-txt">${currentDados.mensagem}</p>
        </div>
        <div class="data-hora">
            <p class="data">${dataFormatada}</p>
            <p class="hora">${horaFormatada}</p>
        </div>
    </div>
    </div>
      `
      }
      else{
      visorMsg.innerHTML += 
      `
      <div class="container-other">
      <div class="mensagem-other">
        <div class="autor">
            <h3 class="autor"><a href="/home/perfil/${currentDados.criador}">${usuarioinfo.nome}</a></h3>
            <div class="linha"></div>
        </div>
        <div class="msg">
            <p class="mensagem-txt">${currentDados.mensagem}</p>
        </div>
        <div class="data-hora">
            <p class="data">${dataFormatada}</p>
            <p class="hora">${horaFormatada}</p>
        </div>
    </div>
    </div>
      `
    }
    }
    visorMsg.scrollTop = visorMsg.scrollHeight;
  })
  
});