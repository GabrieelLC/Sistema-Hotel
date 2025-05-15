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

// Cadastrar cliente
exports.cadastrarCliente = (req, res) => {
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
};

// Listar clientes
exports.listarClientes = (req, res) => {
  db.query('SELECT * FROM cadastro_clientes', (err, results) => {
    if (err) {
      console.error('Erro ao listar clientes:', err);
      return res.status(500).json({ erro: 'Erro ao listar clientes.' });
    }
    res.status(200).json(results);
  });
};

// Cadastrar quarto
exports.cadastrarQuarto = (req, res) => {
  const { Numero, Capacidade } = req.body;
  if (!Numero || !Capacidade) {
    return res.status(400).json({ erro: 'Número e Capacidade do quarto são obrigatórios.' });
  }
  const sql = `INSERT INTO Quartos (Numero, Capacidade) VALUES (?, ?)`;
  db.query(sql, [Numero, Capacidade], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar quarto:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar quarto.' });
    }
    res.status(201).json({ mensagem: 'Quarto cadastrado com sucesso!' });
  });
};

// Registrar consumo no frigobar
exports.registrarFrigobar = (req, res) => {
  const { FkNumero, Produto, Quantidade, Preco } = req.body;
  if (!FkNumero || !Produto || !Quantidade || !Preco) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }
  const sql = `INSERT INTO controle_frigobar (FkNumero, Produto, Quantidade, Preco) VALUES (?, ?, ?, ?)`;
  db.query(sql, [FkNumero, Produto, Quantidade, Preco], (err, result) => {
    if (err) {
      console.error('Erro ao registrar consumo no frigobar:', err);
      return res.status(500).json({ erro: 'Erro ao registrar consumo no frigobar.' });
    }
    res.status(201).json({ mensagem: 'Consumo registrado com sucesso!' });
  });
};

// Registrar check-in/check-out
exports.registrarCheckin = (req, res) => {
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
};
