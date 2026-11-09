const express = require("express");

const router = express.Router();


router.get("/", (req, res) => {

    res.render("index");

});

router.get("/perfil", (req,res) => {
    res.render("perfil/index")
})

router.get("/perfil/:uid", (req, res) => {
    const uid = req.params.uid;

    res.render("perfil/visualizar", {
        uid
    })
})


module.exports = router;