const express = require("express")
const router = express.Router()

router.get("/:uid", (req,res) => {
    const uid = req.params.uid

    res.render("perfil/visualizar", {
        uid
    })
})

module.exports = router;