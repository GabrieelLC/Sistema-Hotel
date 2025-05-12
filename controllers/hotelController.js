const db = require('../models/database');

exports.cadastrarHospede = (req, res) => {
  const { nome, cpf, quarto } = req.body; // Adicionado o campo "quarto"

  if (!nome || !cpf || !quarto) {
    return res.status(400).json({ erro: 'Nome, CPF e Número do Quarto são obrigatórios.' });
  }

  const sql = 'INSERT INTO hospedes (nome, cpf, quarto) VALUES (?, ?, ?)'; // Incluído "quarto"
  db.query(sql, [nome, cpf, quarto], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar hóspede:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar hóspede.' });
    }
    res.status(201).json({ mensagem: 'Hóspede cadastrado com sucesso!', id: result.insertId });
  });
};
