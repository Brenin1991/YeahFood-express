const session = require("express-session");
const usuarioModel = require("../models/usuarioModel");

exports.iniciarSessao = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true
});

exports.copiarSessaoParaViews = (req, res, next) => {
  res.locals.session = req.session;
  next();
};

exports.proteger = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  res.locals.session = req.session;
  next();
};

exports.login = (req, res) => {
  res.status(200).render("login", {
    titulo: "Login"
  });
};

exports.validaLogin = (req, res) => {
  const { email, senha } = req.body;

  let statusCode = 200;
  let mensagem;
  let view;

  const usuario = usuarioModel.usuarios.find(
    u => u.email === email && u.senha === senha
  );

  if (usuario) {
    mensagem = `Seja bem vindo, ${usuario.nome}`;
    view = "index";
    req.session.usuario = usuario;
  } else {
    statusCode = 401;
    mensagem = "Email ou senha incorretos";
    view = "login";
  }

  res.status(statusCode).render(view, { mensagem });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.registrar = (req, res) => {
  res.status(200).render("cadastro", {
    titulo: "Cadastro",
    usuario: {}
  });
};

exports.validaRegistrar = (req, res) => {
  const { nome, email, senha, senhaConfirmacao } = req.body;

  const erros = usuarioModel.validar(
    nome,
    email,
    senha,
    senhaConfirmacao
  );

  if (!erros.temErros()) {
    const id = usuarioModel.ultimoId() + 1;
    const usuario = { id, nome, email, senha };
    usuarioModel.usuarios.push(usuario);
    req.session.usuario = usuario;
    usuarioModel.salvaJSON(() => {
      res.status(200).render("/", {
        usuario,
        mensagem: `Usuário ${usuario.nome} registrado com sucesso.`
      });
    });
  } else {
    const usuarioView = { nome, email };
    res.status(401).render("cadastro", {
      usuario: usuarioView,
      erros
    });
  }
};
