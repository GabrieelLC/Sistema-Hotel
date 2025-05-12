const db = require('../models/database');

exports.cadastrarHospede = (req, res) => {
  const { nome, cpf } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ erro: 'Nome e CPF são obrigatórios.' });
  }

  const sql = 'INSERT INTO hospedes (nome, cpf) VALUES (?, ?)';
  db.query(sql, [nome, cpf], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar hóspede:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar hóspede.' });
    }
    res.status(201).json({ mensagem: 'Hóspede cadastrado com sucesso!', id: result.insertId });
  });
};
