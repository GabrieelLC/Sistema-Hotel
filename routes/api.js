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
  const { CPF, Nome, data_nasc, CEP, Endereco, Email, Telefone, quarto } = req.body;

  if (!CPF || !Nome || !data_nasc || !CEP || !Email || !Telefone || !quarto) {
    return res.status(400).json({ erro: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  const sql = `
    INSERT INTO cadastro_clientes (CPF, Nome, data_nasc, CEP, Endereco, Email, Telefone, quarto)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [CPF, Nome, data_nasc, CEP, Endereco, Email, Telefone, quarto], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar cliente:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar cliente.' });
    }
    res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso!' });
  });
});

// Rota para listar todos os clientes
router.get('/clientes', (req, res) => {
  const sql = 'SELECT * FROM cadastro_clientes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao listar clientes:', err);
      return res.status(500).json({ erro: 'Erro ao listar clientes.' });
    }
    res.status(200).json(results);
  });
});

// Rota para cadastrar um quarto
router.post('/quartos', (req, res) => {
  const { Numero, Capacidade } = req.body;

  if (!Numero || !Capacidade) {
    return res.status(400).json({ erro: 'Número e Capacidade do quarto são obrigatórios.' });
  }

  const sql = `
    INSERT INTO Quartos (Numero, Capacidade)
    VALUES (?, ?)
  `;

  db.query(sql, [Numero, Capacidade], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar quarto:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar quarto.' });
    }
    res.status(201).json({ mensagem: 'Quarto cadastrado com sucesso!' });
  });
});

// Rota para registrar consumo no frigobar
router.post('/frigobar', (req, res) => {
  const { FkNumero, Produto, Quantidade, Preco } = req.body;

  if (!FkNumero || !Produto || !Quantidade || !Preco) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  const sql = `
    INSERT INTO controle_frigobar (FkNumero, Produto, Quantidade, Preco)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [FkNumero, Produto, Quantidade, Preco], (err, result) => {
    if (err) {
      console.error('Erro ao registrar consumo no frigobar:', err);
      return res.status(500).json({ erro: 'Erro ao registrar consumo no frigobar.' });
    }
    res.status(201).json({ mensagem: 'Consumo registrado com sucesso!' });
  });
});

// Rota para registrar check-in/check-out
router.post('/checkin', (req, res) => {
  const { FkCPF, data_check_in, hora_check_in, data_check_out, hora_check_out, FkNumero } = req.body;

  if (!FkCPF || !data_check_in || !hora_check_in || !FkNumero) {
    return res.status(400).json({ erro: 'CPF, Data/Hora de Check-in e Número do Quarto são obrigatórios.' });
  }

  const sql = `
    INSERT INTO controle_checkin_check_out (FkCPF, data_check_in, hora_check_in, data_check_out, hora_check_out, FkNumero)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [FkCPF, data_check_in, hora_check_in, data_check_out, hora_check_out, FkNumero], (err, result) => {
    if (err) {
      console.error('Erro ao registrar check-in/check-out:', err);
      return res.status(500).json({ erro: 'Erro ao registrar check-in/check-out.' });
    }
    res.status(201).json({ mensagem: 'Check-in/Check-out registrado com sucesso!' });
  });
});

module.exports = router;
