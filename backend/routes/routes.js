const express = require('express');
const { Usuarios, Clientes, Quartos, TiposQuarto } = require('../models/models');
const db = require('../config/database'); // Certifique-se de que o caminho para o seu arquivo de configuração do banco de dados está correto

const router = express.Router();

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

router.get('/clientes', (req, res) => {
  Clientes.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar clientes', error: err });
    }
    res.status(200).json(results);
  });
});

router.post('/clientes', (req, res) => {
  const { nome, cpf, telefone, email, endereco, cep } = req.body;
  if (!nome || !cpf || !telefone || !email || !endereco || !cep) {
    return res.status(400).json({ message: 'Preencha todos os campos!' });
  }
  Clientes.create({ nome, cpf, telefone, email, endereco, cep }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao cadastrar cliente', error: err });
    }
    res.status(201).json({ message: 'Cliente cadastrado com sucesso', result });
  });
});

router.get('/clientes/:cpf', (req, res) => {
  const { cpf } = req.params;
  Clientes.findByCpf(cpf, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar cliente', error: err });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json(result[0]);
  });
});

router.put('/clientes/:cpf', (req, res) => {
  const { cpf } = req.params;
  const { nome, telefone, email, endereco, cep } = req.body;
  if (!nome || !telefone || !email || !endereco || !cep) {
    return res.status(400).json({ message: 'Preencha todos os campos!' });
  }
  Clientes.update(cpf, { nome, telefone, email, endereco, cep }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao atualizar cliente', error: err });
    }
    res.status(200).json({ message: 'Cliente atualizado com sucesso', result });
  });
});

router.delete('/clientes/:cpf', (req, res) => {
  const { cpf } = req.params;
  Clientes.delete(cpf, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao deletar cliente', error: err });
    }
    res.status(200).json({ message: 'Cliente deletado com sucesso', result });
  });
});

// Listar todos os quartos
router.get('/quartos', (req, res) => {
  Quartos.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar quartos', error: err });
    }
    res.status(200).json(results);
  });
});

// Buscar quarto por número
router.get('/quartos/:numero', (req, res) => {
  const { numero } = req.params;
  Quartos.findByNumero(numero, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar quarto', error: err });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'Quarto não encontrado' });
    }
    res.status(200).json(result[0]);
  });
});

// Criar novo quarto
router.post('/quartos', (req, res) => {
  const { numero, tipo_id, status } = req.body;
  if (!numero || !tipo_id) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
  }
  Quartos.create({ numero, tipo_id, status }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao cadastrar quarto', error: err });
    }
    res.status(201).json({ message: 'Quarto cadastrado com sucesso', result });
  });
});

// Atualizar quarto por número
router.put('/quartos/:numero', (req, res) => {
  const { numero } = req.params;
  const { tipo_id, status } = req.body;
  if (!tipo_id || !status) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
  }
  Quartos.update(numero, { tipo_id, status }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao atualizar quarto', error: err });
    }
    res.status(200).json({ message: 'Quarto atualizado com sucesso', result });
  });
});

// Deletar quarto por número
router.delete('/quartos/:numero', (req, res) => {
  const { numero } = req.params;
  Quartos.delete(numero, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao deletar quarto', error: err });
    }
    res.status(200).json({ message: 'Quarto deletado com sucesso', result });
  });
});

// Chegadas do dia (check-in)
router.get('/checkins-hoje', (req, res) => {
  const hoje = new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD
  db.query(
    `SELECT c.cpf, c.nome, q.numero as quarto, tq.tipo as tipo_quarto, 
            DATE_FORMAT(r.data_checkin, '%H:%i') as hora, c.telefone, c.email, tq.valor_diaria
     FROM Reservas r
     JOIN Clientes c ON r.cliente_cpf = c.cpf
     JOIN Quartos q ON r.quarto_numero = q.numero
     JOIN TiposQuarto tq ON q.tipo_id = tq.id
     WHERE DATE(r.data_checkin) = ?`,
    [hoje],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar check-ins', error: err });
      res.json(results);
    }
  );
});

// Saídas do dia (check-out)
router.get('/checkouts-hoje', (req, res) => {
  const hoje = new Date().toISOString().slice(0, 10);
  db.query(
    `SELECT c.cpf, c.nome, q.numero as quarto, tq.tipo as tipo_quarto, 
            DATE_FORMAT(r.data_checkout, '%H:%i') as hora, c.telefone, c.email, tq.valor_diaria
     FROM Reservas r
     JOIN Clientes c ON r.cliente_cpf = c.cpf
     JOIN Quartos q ON r.quarto_numero = q.numero
     JOIN TiposQuarto tq ON q.tipo_id = tq.id
     WHERE DATE(r.data_checkout) = ?`,
    [hoje],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar check-outs', error: err });
      res.json(results);
    }
  );
});

// Listar tipos de quarto
router.get('/tipos-quarto', (req, res) => {
  TiposQuarto.findAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar tipos', error: err });
    res.json(results);
  });
});

// Criar novo tipo de quarto
router.post('/tipos-quarto', (req, res) => {
  const { tipo, descricao, valor_diaria } = req.body;
  TiposQuarto.create({ tipo, descricao, valor_diaria }, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao criar tipo', error: err });
    res.status(201).json({ message: 'Tipo criado', result });
  });
});

module.exports = router;
