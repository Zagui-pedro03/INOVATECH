const express = require("express");
const router = express.Router()

router.get("/criar-evento", (req, res) => {
    res.render("eventos/criar-evento");
})

router.post("/criar-evento", (req, res) => {
   
    const {
    nome,
    data,
    local,
    horarioInicio,
    horarioTermino,
    quantVagas,
    descricao,
    tema
} = req.body;

// Variáveis de erros
let errorNome = null;
let errorData = null;
let errorLocal = null;
let errorHorarioInicio = null;
let errorHorarioTermino = null;
let errorQuantVagas = null;
let errorDescricao = null;
let errorTema = null;


// VERIFICAÇÃO DO NOME //

if (typeof nome !== "string" || !nome.trim()) {
    errorNome = "Preencha o campo nome!";
}
else if (nome.trim().length < 3) {
    errorNome = "O nome precisa ter pelo menos 3 caracteres!";
}
else if (nome.trim().length > 80) {
    errorNome = "O nome pode ter no máximo 80 caracteres!";
}

// VERIFICAÇÃO DA DATA //

const hoje = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo"
}).format(new Date());

if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    errorData = "Informe uma data válida!";
}
else if (data < hoje) {
    errorData = "A data não pode estar no passado!";
}


// VERIFICAÇÃO DO LOCAL //

if (typeof local !== "string" || !local.trim()) {
    errorLocal = "Preencha o campo local!";
}
else if (local.trim().length < 3) {
    errorLocal = "O local precisa ter pelo menos 3 caracteres!";
}
else if (local.trim().length > 150) {
    errorLocal = "O local pode ter no máximo 150 caracteres!";
}


// VERIFICAÇÃO DO HORÁRIO DE INÍCIO //

const regexHorario = /^([01]\d|2[0-3]):[0-5]\d$/;

if (typeof horarioInicio !== "string" || !horarioInicio) {
    errorHorarioInicio = "Preencha o horário de início!";
}
else if (!regexHorario.test(horarioInicio)) {
    errorHorarioInicio = "Informe um horário de início válido!";
}


// VERIFICAÇÃO DO HORÁRIO DE TÉRMINO //

if (typeof horarioTermino !== "string" || !horarioTermino) {
    errorHorarioTermino = "Preencha o horário de término!";
}
else if (!regexHorario.test(horarioTermino)) {
    errorHorarioTermino = "Informe um horário de término válido!";
}


// VERIFICAÇÃO DA QUANTIDADE DE VAGAS //

if (quantVagas !== null) {
    if (
        quantVagas === undefined ||
        String(quantVagas).trim() === "" ||
        !Number.isInteger(Number(quantVagas)) ||
        Number(quantVagas) < 1 ||
        Number(quantVagas) > 10000
    ) {
        errorQuantVagas =
            "O limite deve ser um número inteiro entre 1 e 10000!";
    }
}


// VERIFICAÇÃO DA DESCRIÇÃO //

if (typeof descricao !== "string" || !descricao.trim()) {
    errorDescricao = "Preencha a descrição do evento!";
}
else if (descricao.trim().length < 10) {
    errorDescricao =
        "A descrição precisa ter pelo menos 10 caracteres!";
}
else if (descricao.trim().length > 1000) {
    errorDescricao =
        "A descrição pode ter no máximo 1000 caracteres!";
}

// VERIFICAÇÃO DO TEMA //


if(tema === "nada"){
    errorTema = "Escolha um tema para seu evento!"
}

if(errorNome || errorData || errorLocal || errorHorarioInicio || errorHorarioTermino || errorDescricao || errorQuantVagas || errorTema){

    res.status(400).json({
        errorNome,
        errorData,
        errorLocal,
        errorHorarioInicio,
        errorHorarioTermino,
        errorDescricao,
        errorQuantVagas,
        errorTema
    })
}
else if(!errorNome && !errorData && !errorLocal && !errorHorarioInicio && !errorHorarioTermino && !errorDescricao && !errorQuantVagas && !errorTema){
    res.status(200).json({
        correto: true
    })
}


})


router.get("/", (req, res) => {
    res.render("eventos/index");
})

router.get("/pesquisa", (req, res) => {
    res.render("eventos/pesquisa")
})

router.get("/visualizar-evento/:i", (req, res) => {
    const i = req.params.i;

    res.render("eventos/visualizar-criado", {
        i: i
    })

})

router.get("/visualizar-evento/participante/:uid", (req,res) => {
    let uid = req.params.uid

    res.render("perfil/visualizar", {
        uid
    })
})

router.post("/visualizar-evento/editar", (req, res) => {

    const {
        nome,
        data,
        local,
        horarioInicio,
        horarioTermino,
        vagas,
        descricao,
        tema
    } = req.body;


    // Variáveis de erros
    let errorNome = null;
    let errorData = null;
    let errorLocal = null;
    let errorHorarioInicio = null;
    let errorHorarioTermino = null;
    let errorVagas = null;
    let errorDescricao = null;
    let errorTema = null

    // VERIFICAÇÃO DO NOME

    if (typeof nome !== "string" || !nome.trim()) {
        errorNome = "Preencha o campo nome!";
    }
    else if (nome.trim().length < 3) {
        errorNome = "O nome precisa ter pelo menos 3 caracteres!";
    }
    else if (nome.trim().length > 80) {
        errorNome = "O nome pode ter no máximo 80 caracteres!";
    }


    // VERIFICAÇÃO DA DATA

    const hoje = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/Sao_Paulo"
    }).format(new Date());

    if (
        typeof data !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data)
    ) {
        errorData = "Informe uma data válida!";
    }
    else {
        const dataConvertida = new Date(`${data}T12:00:00`);

        if (
            Number.isNaN(dataConvertida.getTime()) ||
            dataConvertida.toISOString().slice(0, 10) !== data
        ) {
            errorData = "Informe uma data válida!";
        }
        else if (data < hoje) {
            errorData = "A data não pode estar no passado!";
        }
    }


    // VERIFICAÇÃO DO LOCAL

    if (typeof local !== "string" || !local.trim()) {
        errorLocal = "Preencha o campo local!";
    }
    else if (local.trim().length < 3) {
        errorLocal = "O local precisa ter pelo menos 3 caracteres!";
    }
    else if (local.trim().length > 150) {
        errorLocal = "O local pode ter no máximo 150 caracteres!";
    }


    // REGEX DOS HORÁRIOS

    const regexHorario = /^([01]\d|2[0-3]):[0-5]\d$/;


    // VERIFICAÇÃO DO HORÁRIO DE INÍCIO

    if (
        typeof horarioInicio !== "string" ||
        !horarioInicio
    ) {
        errorHorarioInicio = "Preencha o horário de início!";
    }
    else if (!regexHorario.test(horarioInicio)) {
        errorHorarioInicio = "Informe um horário de início válido!";
    }


    // VERIFICAÇÃO DO HORÁRIO DE TÉRMINO

    if (
        typeof horarioTermino !== "string" ||
        !horarioTermino
    ) {
        errorHorarioTermino = "Preencha o horário de término!";
    }
    else if (!regexHorario.test(horarioTermino)) {
        errorHorarioTermino = "Informe um horário de término válido!";
    }

    // VERIFICAÇÃO DA QUANTIDADE DE VAGAS

    if (vagas !== "ilimitado") {

        if (
            vagas === undefined ||
            vagas === null ||
            String(vagas).trim() === "" ||
            !Number.isInteger(Number(vagas)) ||
            Number(vagas) < 1 ||
            Number(vagas) > 10000
        ) {
            errorVagas =
                "O limite deve ser um número inteiro entre 1 e 10000!";
        }

    }


    // VERIFICAÇÃO DA DESCRIÇÃO

    if (typeof descricao !== "string" || !descricao.trim()) {
        errorDescricao = "Preencha a descrição do evento!";
    }
    else if (descricao.trim().length < 10) {
        errorDescricao =
            "A descrição precisa ter pelo menos 10 caracteres!";
    }
    else if (descricao.trim().length > 1000) {
        errorDescricao =
            "A descrição pode ter no máximo 1000 caracteres!";
    }

    if(tema === "nada"){
    errorTema = "Escolha um tema para seu evento!"
}

    // RETORNO DOS ERROS

    if (
        errorNome ||
        errorData ||
        errorLocal ||
        errorHorarioInicio ||
        errorHorarioTermino ||
        errorVagas ||
        errorDescricao ||
        errorTema
    ) {
        return res.status(400).json({
            errorNome,
            errorData,
            errorLocal,
            errorHorarioInicio,
            errorHorarioTermino,
            errorVagas,
            errorDescricao,
            errorTema
        });
    }


    // VALIDAÇÃO CONCLUÍDA

    return res.status(200).json({
        correto: true
    });

});

router.get("/visualizar/:i", (req, res) => {
    let i = req.params.i

    res.render("eventos/visualizar", {
        i
    })
})

router.get("/visualizar-eventos-criados/:uid", (req, res) => {
    let uid = req.params.uid;

    res.render("perfil/verMaisEventosCriados", {
        uid
    })
})

router.get("/solicitacoes", (req, res) => {
    res.render("eventos/solicitacao")
})
module.exports = router;