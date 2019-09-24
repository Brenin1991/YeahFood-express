const usuarioModel = require("../models/usuarioModel");

exports.editar = (req, res) => {
  const id = req.params.id * 1;
  const usuario = usuarioModel.usuarios.find(
    u => u.id === id
  );

  if (req.params.id && usuario) {
    res.status(200).render("usuarios/editar", {
      usuario,
      titulo: `Editando ${usuario.nome}`
    });
  } else {
    res.status(404).render("404", {
      titulo: "Recurso Inexistente"
    });
  }
};

exports.atualizar = (req, res) => {
  const { nome, email, senha, senhaConfirmacao } = req.body;
  const id = req.params.id * 1;
  const usuario = usuarioModel.usuarios.find(
    u => u.id === id
  );

  const erros = usuarioModel.validar(
    nome,
    email,
    senha,
    senhaConfirmacao,
    true
  );

  if (!erros.temErros()) {
    usuario.nome = nome;
    usuario.email = email;
    if (senha) {
      usuario.senha = senha;
    }

    usuarioModel.salvaJSON(() => {
      res.status(200).render("sucesso", {
        usuario,
        mensagem: `Os dados cadastrais do usuário ${usuario.nome} foram atualizados.`
      });
    });
  } else {
    const usuarioView = { id, nome, email };
    res.status(401).render("usuarios/editar", {
      usuario: usuarioView,
      erros
    });
  }
};

exports.mostrar = (req, res) => {
  const id = req.params.id * 1;
  const usuario = usuarioModel.usuarios.find(
    u => u.id === id
  );

  if (req.params.id && usuario) {
    res.status(200).render("usuarios/mostrar", {
      usuario,
      titulo: usuario.nome
    });
  } else {
    res.status(404).render("404", {
      titulo: "Recurso Inexistente"
    });
  }
};

exports.todos = (req, res) => {
  res.status(200).render("usuarios/todos", {
    usuarios: usuarioModel.usuarios,
    titulo: "Usuários Cadastrados"
  });
};
