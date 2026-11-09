import { db, auth } from "./firebase.js";

import { ref, set } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

import { 
    onAuthStateChanged, signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const divErro = document.getElementById("erro")
    try {

        const usuario = await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );


        window.location.href = "home";

    } catch (erro) {

        console.error(erro);
        divErro.style.display = "flex";

    }

});