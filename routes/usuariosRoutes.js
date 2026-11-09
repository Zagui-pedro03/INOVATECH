const express = require("express");
const router = express.Router();

// Abre a página de usuários
router.get("/", (req, res) => {
  res.render("usuarios");
});

module.exports = router;