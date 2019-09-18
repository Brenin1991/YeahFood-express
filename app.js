const express = require("express");
const path = require("path");
const usuarioRouter = require("./routes/usuarioRoutes");
const autenticacaoRouter = require("./routes/autenticacaoRoutes");
const autenticacaoController = require("./controllers/autenticacaoController");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(autenticacaoController.iniciarSessao);
app.use(autenticacaoController.copiarSessaoParaViews);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

////////////////////////////////////////////////////

app.use("/", autenticacaoRouter);
app.use("/usuarios", usuarioRouter);

app.get("/", (req, res) => {
	res.status(200).render("index");
});

app.all("*", (req, res) => {
	res.status(404).render("404", {
		titulo: "Recurso Inexistente"
	});
});

const porta = 3000;
app.listen(porta, () => {
	console.log(
		`Servidor rodando em http://localhost:${porta} ...`
	);
});
