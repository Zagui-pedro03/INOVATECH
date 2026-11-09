const express = require("express");
const router = express.Router();



router.get("/", (req, res) => {
    res.render("cadastros/index", {
        erroNome: null,
        erroEmail: null,
        erroSenha: null,
        erroConfirmacao: null
    })
})

router.get("/index", (req,res) => {
    res.redirect("cadastros/index")
})

router.post("/", (req, res) => {
    const { nome, email, senha, confirmacaoSenha } = req.body;

    let erroNome = null
    let erroEmail = null
    let erroSenha= null
    let erroConfirmacao= null

    if (!nome) {
         res.status(400)
        erroNome = "Insira o nome completo"
    }

    if (!email.includes("@") || !email.includes('.com')) {
         res.status(400)
        erroEmail = "Insira um email válido"
    }
    if(senha.length === 0){
        res.status(400)
        erroSenha = "Digite uma senha"
    }

    if (senha.length > 0 && senha.length < 6) {
         res.status(400)
        erroSenha = "Senha muito curta"        
    }

    if (senha !== confirmacaoSenha) {
         res.status(400)
        erroConfirmacao = "As senhas não coincidem"
    }
    if(confirmacaoSenha.length == 0){
        res.status(400)
        erroConfirmacao = "Digite a mesma senha para confirmar"
    }

    if(erroNome || erroEmail || erroSenha || erroConfirmacao){
        return res.status(400).json({
            erroNome,
            erroEmail,
            erroSenha,
            erroConfirmacao
        })
    }

    if(!erroNome && !erroEmail && !erroSenha && !erroConfirmacao){
    res.status(201).json({
        mensagem: "Cadastro realizado!"
    });
    }
});

module.exports = router;