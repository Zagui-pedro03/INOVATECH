const express = require("express")
const router = express.Router();

router.get("/criar-sala", (req,res) => {

    res.render("salas/criar-sala");
    
})

router.post("/criar-sala", (req, res) => {
    let {nome, categoria, descricao} = req.body

    let errorNome = null;
    let errorCategoria = null;
    let errorDescricao = null;

    // VALIDAÇÃO NOME //

    if(nome === ""){
        errorNome = "Digite o nome da sala!"
    }
    else if(String(nome).length >= 60){
        errorNome = "O nome pode ter no máximo 60 caracteres"
    }

    // VALIDAÇÃO CATEGORIA //

    if( categoria === "nada"){
        errorCategoria = "Escolha uma categoria para a sua sala!"
    }

    // VALIDAÇÃO DESCRIÇÃO //

    if(descricao === ""){
        errorDescricao = "Escreva uma descrição para a sua sala!"
    }

    else if(String(descricao).length < 10){
        errorDescricao = "A descrição precisa ter no mínimo 10 caracteres!"
    }
    
    else if(String(descricao).length >= 1000){
        errorDescricao = "A descrição deve conter no máximo 1000 caracteres!"
    }

    // VERIFICAÇÃO FINAL //

    if(
        errorNome ||
        errorCategoria ||
        errorDescricao
    ){
        res.status(400).json({
            errorNome,
            errorCategoria,
            errorDescricao
        })
    } else {
        res.status(200).json({
            correto: true
        })
    }
})

router.get("", (req, res) => {
    res.render("salas/index")
})

router.get("/solicitacoes", (req, res) => {
    res.render("salas/solicitacao")
})

router.get("/sala-geral/:id", (req, res) => {
    const id = req.params.id

    res.render("salas/sala-geral", {
        id
    })
})
router.get("/sala-avisos/:id", (req, res) => {
    const id = req.params.id

    res.render("salas/sala-avisos", {
        id
    })
})
module.exports = router;