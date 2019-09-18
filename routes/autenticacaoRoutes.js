const express = require("express");
const autenticacaoController = require("../controllers/autenticacaoController");

const router = express.Router();
router
	.get("/login", autenticacaoController.login)
	.post("/login", autenticacaoController.validaLogin)
	.get("/cadastro", autenticacaoController.registrar)
	.post(
		"/cadastro",
		autenticacaoController.validaRegistrar
	)
	.get("/logout", autenticacaoController.logout);

module.exports = router;
