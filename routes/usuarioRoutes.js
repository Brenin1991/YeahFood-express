const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const { proteger } = require('../controllers/autenticacaoController');

const router = express.Router();
router
  .get('/:id/editar', proteger, usuarioController.editar)
  .post('/:id/editar', proteger, usuarioController.atualizar)
  .get('/:id', proteger, usuarioController.mostrar)
  .get('/', proteger, usuarioController.todos);

module.exports = router;
