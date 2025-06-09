const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Usuarios } = require('../models/models');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rota de login
app.post('/api/login', (req, res) => {
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
