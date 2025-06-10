const db = require('../config/database');

const Usuarios = {
  findAll: (callback) => {
    db.query('SELECT * FROM Usuarios', callback);
  },
  findById: (id, callback) => {
    db.query('SELECT * FROM Usuarios WHERE id = ?', [id], callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO Usuarios (usuario, senha, nome, nivel_acesso) VALUES (?, ?, ?, ?)', 
      [data.usuario, data.senha, data.nome, data.nivel_acesso], callback);
  },
  update: (id, data, callback) => {
    db.query('UPDATE Usuarios SET usuario = ?, senha = ?, nome = ?, nivel_acesso = ? WHERE id = ?', 
      [data.usuario, data.senha, data.nome, data.nivel_acesso, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM Usuarios WHERE id = ?', [id], callback);
  },
};

const TiposQuarto = {
  findAll: (callback) => {
    db.query('SELECT * FROM TiposQuarto', callback);
  },
  findById: (id, callback) => {
    db.query('SELECT * FROM TiposQuarto WHERE id = ?', [id], callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO TiposQuarto (tipo, descricao, valor_diaria) VALUES (?, ?, ?)', 
      [data.tipo, data.descricao, data.valor_diaria], callback);
  },
  update: (id, data, callback) => {
    db.query('UPDATE TiposQuarto SET tipo = ?, descricao = ?, valor_diaria = ? WHERE id = ?', 
      [data.tipo, data.descricao, data.valor_diaria, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM TiposQuarto WHERE id = ?', [id], callback);
  },
};

const Clientes = {
  findAll: (callback) => {
    db.query('SELECT * FROM Clientes', callback);
  },
  findByCpf: (cpf, callback) => {
    db.query('SELECT * FROM Clientes WHERE cpf = ?', [cpf], callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO Clientes (cpf, nome, telefone, email, endereco, cep) VALUES (?, ?, ?, ?, ?, ?)', 
      [data.cpf, data.nome, data.telefone, data.email, data.endereco, data.cep], callback);
  },
  update: (cpf, data, callback) => {
    db.query('UPDATE Clientes SET nome = ?, telefone = ?, email = ?, endereco = ?, cep = ? WHERE cpf = ?', 
      [data.nome, data.telefone, data.email, data.endereco, data.cep, cpf], callback);
  },
  delete: (cpf, callback) => {
    db.query('DELETE FROM Clientes WHERE cpf = ?', [cpf], callback);
  },
};

const Quartos = {
  findAll: (callback) => {
    db.query('SELECT * FROM Quartos', callback);
  },
  findByNumero: (numero, callback) => {
    db.query('SELECT * FROM Quartos WHERE numero = ?', [numero], callback);
  },
  create: (data, callback) => {
    // status é opcional, se não vier, usa 'disponivel'
    const status = data.status || 'disponivel';
    db.query(
      'INSERT INTO Quartos (numero, tipo_id, status) VALUES (?, ?, ?)',
      [data.numero, data.tipo_id, status],
      callback
    );
  },
  update: (numero, data, callback) => {
    db.query(
      'UPDATE Quartos SET tipo_id = ?, status = ? WHERE numero = ?',
      [data.tipo_id, data.status, numero],
      callback
    );
  },
  delete: (numero, callback) => {
    db.query('DELETE FROM Quartos WHERE numero = ?', [numero], callback);
  },
};

module.exports = {
  Usuarios,
  TiposQuarto,
  Clientes,
  Quartos,
};