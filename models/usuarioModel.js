const fs = require('fs');
const path = require('path');

let usuarios;

exports.ultimoId = () => {
  let id = -1;
  usuarios.forEach(u => {
    // eslint-disable-next-line prefer-destructuring
    if (u.id > id) id = u.id;
  });
  return id;
};

exports.validar = (nome, email, senha, senhaConfirmacao, edicao = false) => {
  const erros = {
    nome: [],
    email: [],
    senha: [],
    senhaConfirmacao: [],
    temErros: function() {
      return (
        this.nome.length > 0 ||
        this.email.length > 0 ||
        this.senha.length > 0 ||
        this.senhaConfirmacao.length > 0
      );
    }
  };

  if (!nome) {
    erros.nome.push('Por favor, informe o seu nome.');
  }
  if (!email) {
    erros.email.push('Por favor, informe o seu e-mail.');
  }
  if (!edicao) {
    if (!senha) {
      erros.senha.push('Por favor, informe a sua senha.');
    }
    if (!senhaConfirmacao) {
      erros.senhaConfirmacao.push('Por favor, confirme a sua senha.');
    }
  }
  if (senha !== senhaConfirmacao) {
    erros.senhaConfirmacao.push('A senha informada não é igual à confirmação.');
  }

  return erros;
};

exports.salvaJSON = callback => {
  const usuariosJSON = JSON.stringify(usuarios);
  fs.writeFile(
    path.join(__dirname, '..', 'arquivos', 'usuarios.json'),
    usuariosJSON,
    'utf-8',
    callback
  );
};

const leJSON = () => {
  const dados = fs.readFileSync(
    path.join(__dirname, '..', 'arquivos', 'usuarios.json'),
    'utf-8'
  );
  usuarios = JSON.parse(dados);
  return usuarios;
};

usuarios = leJSON();
exports.usuarios = usuarios;
