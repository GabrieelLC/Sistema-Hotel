const express = require('express');
const router = express.Router();
const db = require('../models/database'); // Conexão com o MySQL

// Exemplo de rota de teste
router.get('/teste', (req, res) => {
  db.query('SELECT NOW() AS agora', (err, result) => {
    if (err) return res.status(500).send('Erro no banco');
    res.json(result[0]);
  });
});

// Rota para cadastrar um cliente
router.post('/clientes', (req, res) => {
  const { CPF, Nome, data_nasc, CEP, Endereco, Email, Telefone } = req.body;

  // Verificar se todos os campos obrigatórios foram enviados
  if (!CPF || !Nome || !data_nasc || !CEP || !Email || !Telefone) {
    return res.status(400).json({ erro: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  const sql = `
    INSERT INTO cadastro_clientes (CPF, Nome, data_nasc, CEP, Endereco, Email, Telefone)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [CPF, Nome, data_nasc, CEP, Endereco, Email, Telefone], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar cliente:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar cliente.' });
    }
    res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso!' });
  });
});

module.exports = router;
