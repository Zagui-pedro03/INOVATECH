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

  const criador = false

  onValue(ref(db, `Salas/${idSala}`), async (snapshotSala) => {
    let dados = snapshotSala.val();
   
        let nomeSala = document.getElementById("nomeSala")
        let categoriaSala = document.getElementById("categoriaSala")

        nomeSala.innerText = `${dados.nome}`
        categoriaSala.innerText = dados.categoria

        if(String(dados.criador) === String(usuario.uid)){
          document.getElementById("escrever-mensagem").style.display = "flex"
        } else {
          document.getElementById("escrever-mensagem").style.display = "none"
        }

        
  })


  const enviarMsg = document.getElementById("enviarMsg")

        enviarMsg.addEventListener('click', async (event) => {
          event.preventDefault()
    
          let campoMensagem = document.getElementById("msg");
          const mensagem = campoMensagem.value.trim();

          if(mensagem === ""){
            
          }

          const referenciaMsg = ref(db,`/Salas/${idSala}/Avisos`)

          await push(referenciaMsg, {
            mensagem,
            criador: usuario.uid,
            dataHora: serverTimestamp()
          })
          
          campoMensagem.value = ""

        })

        // ===========================
        // LISTAGEM DOS AVISOS
        // ===========================
        let listaAvisos = document.querySelector(".visor-mensagens")

        onValue(ref(db, `Salas/${idSala}/Avisos`), (snapshotAvisos) => {
           listaAvisos.innerHTML = ""
          let dados = snapshotAvisos.val()
         
          for(let i in dados){
            let currentAviso = dados[i]

            if(!currentAviso){
              continue;
            }

            let data = new Date(currentAviso.dataHora)

            let dataFormatada = data.toLocaleDateString("pt-BR");
            let horaFormatada = data.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit"
            });

            listaAvisos.innerHTML += `
            <div class="card-aviso">

                <p class="texto-aviso">
                    ${escaparHTML(currentAviso.mensagem ?? "")}
                </p>

                <div class="info-aviso">

                    <span class="data-aviso">
                       ${dataFormatada}
                    </span>

                    <span class="hora-aviso">
                       ${horaFormatada}
                    </span>

                </div>

            </div>
        `;
          }
          listaAvisos.scrollTop = listaAvisos.scrollHeight;

          function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}
        })

});