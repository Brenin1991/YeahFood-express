const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

let usuarios;
fs.readFile('arquivos/usuarios.json', 'utf8', (err, data) => {
	if (err) {
		throw err;
	} else {
		usuarios = JSON.parse(data);
	}
});

function validarEdicao(usuario, id, email, senha, confirmarSenha) {
	let mensagem;
	if (email == '') {
		mensagem = 'Preencha todos os campos!';
	} else {
		if (usuario == undefined || usuario.id == id) {
			if (senha == '' && confirmarSenha == '') {
				mensagem = 1;
			} else if (senha != '' && confirmarSenha != '') {
				if (senha == confirmarSenha) {
					mensagem = 2;
				} else {
					mensagem = 'As senhas não coincidem!';
				}
			} else {
				mensagem = 'Preencha todos os campos!';
			}
		} else {
			mensagem = 'Email em uso!';
		}
	}
	return mensagem;
}

app.get('/usuarios/login', (req, res) => {
	res.status(200).render('usuarios/login');
});

app.get('/usuarios', (req, res) => {
	res.status(200).render('usuarios/todos', {
		usuarios
	});
});

app.get('/index', (req, res) => {
	res.status(200).render('index', {
		usuarios
	});
});

app.get('/login', (req, res) => {
	res.status(200).render('login');
});

app.get('/cadastro', (req, res) => {
	res.status(200).render('cadastro');
});

app.get('/usuarios/mostrar/:id', (req, res) => {
	const id = req.params.id * 1;
	const usuario = usuarios.find(u => u.id === id);
	if (usuario) {
		res.status(200).render('usuarios/mostrar', {
			usuario //abreviação de usuario:usuario
		});
	} else {
		res.status(404).render('404');
	}
});

app.get('/usuarios/editar/:id', (req, res) => {
	const id = req.params.id * 1;
	const usuario = usuarios.find(u => u.id === id);
	if (usuario) {
		res.status(200).render('usuarios/editar', {
			usuario //abreviação de usuario:usuario
		});
	} else {
		res.status(404).render('404');
	}
});

app.post('/usuarios/editar', (req, res) => {
	const { email, senha, confirmarSenha } = req.body;
	const id = req.body.id * 1;
	const atual = usuarios.find(u => u.id == id);
	let usuario = usuarios.find(u => u.email === email);
	const mensagem = validarEdicao(usuario, id, email, senha, confirmarSenha);
	if (mensagem == 1 || mensagem == 2) {
		if (usuario == undefined) {
			usuario = atual;
		}
		if (mensagem == 1) {
			usuario.email = email;
		} else if (mensagem == 2) {
			usuario.email = email;
			usuario.senha = senha;
		}
		const usuariosJSON = JSON.stringify(usuarios);
		fs.writeFile(
			path.join(__dirname, 'arquivos', 'usuarios.json'),
			usuariosJSON,
			'utf-8',
			erro => {
				// Aqui eu sei que o salvamento terminou (com sucesso ou erro)
				// e eu devo usar para montar a minha response
				console.log(erro);
				res.status(200).render('usuarios/mostrar', {
					usuario
				});
			}
		);
	} else {
		res.status(200).render('usuarios/editar', {
			usuario: atual,
			mensagem
		});
	}
});

app.get('*', (req, res) => {
	res.status(200).render('404');
});


const porta = 3000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}.`);
  console.log(`Acesse http://localhost:${porta} para testar.`);
});
