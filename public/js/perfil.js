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
 
       // =========================
       // VERIFICAR LOGIN
       // =========================
 
       if (!usuario) {
           window.location.href = "login";
           return;
       }
 
       // =========================
       // REFERÊNCIA DO USUÁRIO
       // =========================
 
       const referencia = ref(
           db,
           `Usuários/${usuario.uid}`
       );
 
       // =========================
       // BUSCAR DADOS DO USUÁRIO
       // =========================
 
       const snapshot = await get(referencia);
 
       const dados = snapshot.val();
 
       // =========================
       // DADOS DO HEADER
       // =========================
 
       const primeiraLetra = document.getElementById("primeira-letra");
 
       primeiraLetra.innerText =
           String(dados.nome[0]).toUpperCase();
 
       document.getElementById("nome").innerText =
           String(dados.nome);
 
       document.getElementById("email").innerText =
           String(dados.email);
 
       // =========================
       // ELEMENTOS DO HTML
       // =========================
 
       const nomeText = document.getElementById("nomeText");
       const emailText = document.getElementById("emailText");
 
       const recadoText = document.getElementById("recado");
       const info = document.getElementById("info");
 
       const qualidade = document.getElementById("qualidade");
       const salvarQualidade = document.getElementById("salvar-qualidade");
 
       const listaQualidades = document.getElementById(
           "listar-qualidade"
       );
 
       const formulario = document.getElementById("formulario");
 
       // =========================
       // DADOS DO USUÁRIO
       // =========================
 
       nomeText.innerText = String(dados.nome).toUpperCase();
       emailText.innerText = dados.email;
 
       
       // =========================
       // RECADO DO USUÁRIO
       // =========================
       if(dados.recado){
       recadoText.innerText = dados.recado
       }
       // =========================
       // EVENTOS CRIADOS
       // =========================
 
   const eventosCriados =
       document.getElementById("n_eventosCriados");
 
  onValue(
       ref(db, "Eventos"),
       (snapshotEventos) => {
 
           const eventos = snapshotEventos.val();
 
           let contador = 0;
 
           const containerCriados =
               document.getElementById("eventosCriados");
 
           containerCriados.innerHTML = "";
 
           if (eventos) {
 
               for (let i in eventos) {
 
                   if (eventos[i].criador === usuario.uid) {
 
                       contador++;
 
                       // Mostra os eventos normalmente
                       // até o quinto
                       if (contador <= 5) {
 
                           containerCriados.innerHTML += `
                               <div class="evento">
 
                                   <div class="info-evento">
 
                                       <p id="tituloEvento">
                                           ${eventos[i].nome}
                                       </p>
 
                                       <p id="enderecoEvento">
                                           ${eventos[i].tema}
                                       </p>
 
                                   </div>
                                    <div class="acoes-evento">
                                   <a href="/eventos/visualizar-evento/${String(i)}" class="verEvento">
                                       Visualizar
                                   </a>
                                   <a href="/eventos/visualizar-evento/${String(i)}" class="verEvento">
                                       Entrar na sala
                                   </a>
                                    </div>
                               </div>
                           `;
                       }
                   }
               }
           }
 
           eventosCriados.textContent = String(contador);
 
           // Só cria o botão se houver mais de 5
           if (contador > 5) {
 
               containerCriados.innerHTML += `
                   <button type="button" id="verTodosCriados">
                       <a href="/eventos/visualizar-eventos-criados/${usuario.uid}">Ver mais </a>
                   </button>
               `;
           }
       }
   );
 
       // =========================
       // EVENTOS INSCRITOS
       // =========================
 
   onValue(
       ref(db, "Eventos/"),
       (snapshotInscritos) => {
 
           const dadosEventos = snapshotInscritos.val();
 
           let contadorParticipantes = 0;
 
           const container =
               document.getElementById("eventosInscritos");
 
           container.innerHTML = "";
 
           if (dadosEventos) {
 
               for (let i in dadosEventos) {
 
                   const eventoAtual = dadosEventos[i];
 
                   if (!eventoAtual) {
                       continue;
                   }
 
                   if (!eventoAtual.nome || !eventoAtual.local) {
                       continue;
                   }
 
                   if (!eventoAtual.Participantes) {
                       continue;
                   }
                   
                   if(eventoAtual.criador === usuario.uid){
                    continue;
                   }
                   for (let j in eventoAtual.Participantes) {
 
                       if (j === usuario.uid) {
 
                           contadorParticipantes++;
 
                           if (contadorParticipantes <= 5) {

                               container.innerHTML += `
                                   <div class="evento">
 
                                       <div class="info-evento">
 
                                           <p id="tituloEvento">
                                               ${eventoAtual.nome}
                                           </p>
 
                                           <p id="enderecoEvento">
                                               ${eventoAtual.tema}
                                           </p>
 
                                       </div>
 
                                       <a href="/eventos/visualizar/${i}" class="verEvento">
                                           Visualizar
                                       </a>
 
                                   </div>
                               `;
                           }
 
                           break;
                       }
                   }
               }
           }
 
           document.getElementById(
               "n_eventosInscritos"
           ).textContent = String(contadorParticipantes);
 
           if (contadorParticipantes > 5) {
 
               container.innerHTML += `
                   <button type="button" id="verTodosInscritos">
                       Ver mais
                   </button>
               `;
           }
       });
 
       // =========================
       // SALAS CRIADAS
       // =========================
 
   const salasCriadas =
       document.getElementById("n_salasCriadas");
 
   onValue(
       ref(db, "Salas"),
       (snapshotSalas) => {
 
           const salas = snapshotSalas.val();
 
           let contador = 0;
 
           const containerCriadas =
               document.getElementById("salasCriadas");
 
           containerCriadas.innerHTML = "";
 
           if (salas) {
 
               for (let i in salas) {
 
                   if (salas[i].criador === usuario.uid) {
                    
                    if(!salas[i].codigo_evento){

                       contador++;
 
                       // Mostra os eventos normalmente
                       // até o quinto
                       if (contador <= 5) {
 
                           containerCriadas.innerHTML += `
                               <div class="sala">
 
                                   <div class="info-sala">
 
                                       <p id="tituloSala">
                                           ${salas[i].nome}
                                       </p>
 
                                       <p id="temaSala">
                                           ${salas[i].categoria}
                                       </p>
 
                                   </div>
 
                                   <a href="/salas/sala-geral/${String(i)}" class="verSala">
                                       Visualizar
                                   </a>
 
                               </div>
                           `;
                       }
                   }
                }
               }
           }
 
           salasCriadas.textContent = String(contador);
 
           // Só cria o botão se houver mais de 5
           if (contador > 5) {
 
               containerCriadas.innerHTML += `
                   <button type="button" id="verTodasCriadas">
                       <a href="/salas/visualizar-salas-criadas/${usuario.uid}">Ver mais </a>
                   </button>
               `;
           }
       }
   );
 
   // =========================
       // SALAS INSCRITAS
       // =========================
 
   onValue(
       ref(db, "Salas/"),
       (snapshotInscritas) => {
 
           const dadosSalas = snapshotInscritas.val();
 
           let contadorParticipantes = 0;
 
           const container =
               document.getElementById("salasInscritas");
 
           container.innerHTML = "";
 
           if (dadosSalas) {
 
               for (let i in dadosSalas) {
 
                   const salaAtual = dadosSalas[i];
 
                   if (!salaAtual) {
                       continue;
                   }
 
                   if (!salaAtual.nome || !salaAtual.tema) {
                       continue;
                   }
 
                   if (!salaAtual.Integrantes) {
                       continue;
                   }
 
                   for (let j in salaAtual.Integrantes) {
 
                       if (j === usuario.uid) {
 
                           contadorParticipantes++;
 
                           if (contadorParticipantes <= 5) {
 
                               container.innerHTML += `
                                   <div class="sala">
 
                                       <div class="info-sala">
 
                                           <p id="tituloSala">
                                               ${salaAtual.nome}
                                           </p>
 
                                           <p id="temaSala">
                                               ${salaAtual.categoria}
                                           </p>
 
                                       </div>
 
                                       <a href="/salas/visualizar/${i}" class="verSala">
                                           Visualizar
                                       </a>
 
                                   </div>
                               `;
                           }
 
                           break;
                       }
                   }
               }
           }
 
           document.getElementById(
               "n_salasInscritas"
           ).textContent = String(contadorParticipantes);
 
           if (contadorParticipantes > 5) {
 
               container.innerHTML += `
                   <button type="button" id="verTodasInscritas">
                       Ver mais
                   </button>
               `;
           }
       });
       // =========================
       // DESCRIÇÃO
       // =========================
 
       if (dados.descricao) {
           info.value = dados.descricao;
       }
 
       // =========================
       // REFERÊNCIA DAS QUALIDADES
       // =========================
 
       const referenciaQualidades = ref(
           db,
           `Usuários/${usuario.uid}/qualidades`
       );
 
       // =========================
       // LISTAR QUALIDADES
       // =========================
 
       function listarQualidades(qualidades) {
 
           listaQualidades.innerHTML = "";
 
           if (!qualidades) {
               return;
           }
 
           for (let id in qualidades) {
 
               const qualidadeText =
                   document.createElement("p");
 
               qualidadeText.innerHTML = `
                   ${qualidades[id]}
 
                   <div
                       id="excluir"
                       onclick="excluir('${id}')"
                   >
                       <img
                           src="/assets/img/close.png"
                           height="12"
                       >
                   </div>
               `;
 
               listaQualidades.appendChild(
                   qualidadeText
               );
           }
       }
 
       // =========================
       // OBSERVAR QUALIDADES
       // =========================
 
       onValue(
           referenciaQualidades,
           (snapshotQualidades) => {
 
               const qualidades =
                   snapshotQualidades.val();
 
               listarQualidades(qualidades);
           }
       );
 
       // =========================
       // EXCLUIR QUALIDADE
       // =========================
 
       window.excluir = async function (id) {
 
           try {
 
               const referenciaExcluir = ref(
                   db,
                   `Usuários/${usuario.uid}/qualidades/${id}`
               );
 
               await remove(
                   referenciaExcluir
               );
 
           } catch (erro) {
 
               console.error(
                   "Erro ao excluir qualidade:",
                   erro
               );
           }
       };
 
       // =========================
       // SALVAR QUALIDADE
       // =========================
 
       salvarQualidade.addEventListener(
           "click",
           async () => {
 
               const texto =
                   qualidade.value.trim();
 
               if (texto === "") {
 
                   alert(
                       "Digite uma qualidade."
                   );
 
                   return;
               }
 
               // Cria uma nova chave
               const novaQualidade =
                   push(referenciaQualidades);
 
               // Salva no Firebase
               await set(
                   novaQualidade,
                   texto
               );
 
               // Limpa o input
               qualidade.value = "";
           }
       );
 
       // =========================
       // SALVAR DESCRIÇÃO E RECADO
       // =========================
 
       formulario.addEventListener(
           "submit",
           async (event) => {
 
               event.preventDefault();
 
               const descricao =
                   info.value.trim();
 
               const recado = recadoText.value.trim()
               await set(
                   ref(
                       db,
                       `Usuários/${usuario.uid}/descricao`
                   ),
                   descricao
               );
 
               await set(ref(db, `Usuários/${usuario.uid}/recado`), recado)
 
               alert(
                   "Perfil atualizado!"
               );
           }
       );
 
   });