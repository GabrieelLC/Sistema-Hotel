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
    if (err) return res.status(500).json({ message: 'Erro ao buscar clientes', error: err });
    res.json(results);
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
     WHERE DATE(r.data_checkout) = ? AND r.status = 'finalizado'`,
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

router.post('/checkin', (req, res) => {
  const {
    cliente_cpf,
    quarto_numero,
    data_checkin,
    hora_checkin,
    data_checkout_prevista,
    hora_checkout_prevista,
    valor_diaria,
    desconto
  } = req.body;

  if (!cliente_cpf || !quarto_numero || !data_checkin || !hora_checkin || !data_checkout_prevista || !hora_checkout_prevista || !valor_diaria) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
  }

  db.query(
    `INSERT INTO Reservas 
      (cliente_cpf, quarto_numero, data_checkin, hora_checkin, data_checkout, hora_checkout, valor_diaria, desconto, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ativo')`,
    [
      cliente_cpf,
      quarto_numero,
      data_checkin,
      hora_checkin,
      data_checkout_prevista,
      hora_checkout_prevista,
      valor_diaria,
      desconto || 0
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar check-in', error: err });
      }
      res.status(201).json({ message: 'Check-in registrado com sucesso', result });
    }
  );
});

// PUT /api/checkout/:id - Registrar check-out
router.put('/checkout/:id', (req, res) => {
  const { id } = req.params;
  const { data_checkout, hora_checkout, desconto } = req.body;

  if (!data_checkout || !hora_checkout) {
    return res.status(400).json({ message: 'Preencha data e hora do check-out!' });
  }

  db.query(
    `UPDATE Reservas SET data_checkout = ?, hora_checkout = ?, desconto = ?, status = 'finalizado' WHERE id = ?`,
    [data_checkout, hora_checkout, desconto || 0, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar check-out', error: err });
      }
      // Atualize o status do quarto
      db.query(
        `UPDATE Quartos SET status = 'disponivel' WHERE numero = (SELECT quarto_numero FROM Reservas WHERE id = ?)`,
        [id],
        (err2) => {
          if (err2) {
            return res.status(500).json({ message: 'Erro ao atualizar status do quarto', error: err2 });
          }
          res.status(200).json({ message: 'Check-out registrado com sucesso', result });
        }
      );
    }
  );
});

// GET /api/reservas?futuras=1
router.get('/reservas', (req, res) => {
  const { futuras } = req.query;
  let sql = `
    SELECT c.nome, r.quarto_numero as quarto, 
           DATE_FORMAT(r.data_checkin, '%d/%m/%Y') as data_entrada,
           DATE_FORMAT(r.hora_checkin, '%H:%i') as hora_entrada,
           DATE_FORMAT(r.data_checkout, '%d/%m/%Y') as data_saida,
           DATE_FORMAT(r.hora_checkout, '%H:%i') as hora_saida,
           r.status
    FROM Reservas r
    JOIN Clientes c ON r.cliente_cpf = c.cpf
  `;
  const params = [];
  if (futuras === '1') {
    sql += ' WHERE r.data_checkin >= CURDATE()';
  }
  sql += ' ORDER BY r.data_checkin DESC, r.hora_checkin DESC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar reservas', error: err });
    res.json(results);
  });
});

// GET /api/reserva-ativa/:cpf
router.get('/reserva-ativa/:cpf', (req, res) => {
  const cpf = req.params.cpf;
  db.query(
    `SELECT r.*, c.nome, c.telefone, c.email, c.cep, c.endereco, q.numero as quarto, tq.valor_diaria, r.desconto
     FROM Reservas r
     JOIN Clientes c ON r.cliente_cpf = c.cpf
     JOIN Quartos q ON r.quarto_numero = q.numero
     JOIN TiposQuarto tq ON q.tipo_id = tq.id
     WHERE r.cliente_cpf = ? AND r.status = 'ativo'
     ORDER BY r.data_checkin DESC LIMIT 1`,
    [cpf],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar reserva', error: err });
      if (!results.length) return res.status(404).json({ message: 'Nenhuma reserva ativa encontrada' });
      res.json(results[0]);
    }
  );
});

async function realizarCheckout(reservaId, data_checkout, hora_checkout, desconto) {
  const resp = await fetch(`/api/checkout/${reservaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data_checkout, hora_checkout, desconto })
  });
  if (resp.ok) {
    alert('Checkout realizado com sucesso!');
    // Atualize a tela, redirecione, etc.
  } else {
    alert('Erro ao realizar checkout');
  }
}

module.exports = router;
