const express = require('express');
const { Usuarios, Clientes } = require('../models/models');

const router = express.Router();

// Rota de login
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  Usuarios.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor', error: err });
    }

    const user = results.find(u => u.usuario === usuario);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (senha !== user.senha) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso', user });
  });
});

// Rota para listar todos os clientes
router.get('/clientes', (req, res) => {
  Clientes.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar clientes', error: err });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
