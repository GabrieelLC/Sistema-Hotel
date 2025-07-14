const express = require('express');
const { Usuarios, Clientes, Quartos, TiposQuarto, Reservas, Consumos } = require('../models/models');
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
  const { nome, cpf, telefone, email, endereco, cep, passaporte, data_nascimento, nacionalidade } = req.body;
  db.query(
    'INSERT INTO Clientes (nome, cpf, telefone, email, endereco, cep, passaporte, data_nascimento, nacionalidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      nome,
      cpf,
      telefone,
      email,
      endereco,
      cep,
      passaporte && passaporte.trim() !== '' ? passaporte : null, // <-- Torna opcional
      data_nascimento,
      nacionalidade
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erro ao cadastrar cliente', error: err.sqlMessage || err.message });
      res.status(201).json({ message: 'Cliente cadastrado com sucesso', result });
    }
  );
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
  db.query(
    `SELECT q.numero, tq.tipo, q.descricao, 
            COALESCE(q.valor_diaria, tq.valor_diaria) as valor_diaria, 
            q.status
     FROM Quartos q
     JOIN TiposQuarto tq ON q.tipo_id = tq.id`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar quartos', error: err });
      res.json(results);
    }
  );
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
  console.log('Dados recebidos no cadastro de quarto:', req.body); // ADICIONE ESTA LINHA
  const { numero, tipo_id, descricao, valor_diaria, status } = req.body;
  if (!numero || !tipo_id || !descricao || !valor_diaria) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
  }
  Quartos.create({ numero, tipo_id, descricao, valor_diaria, status }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao cadastrar quarto', error: err });
    }
    res.status(201).json({ message: 'Quarto cadastrado com sucesso', result });
  });
});

// Atualizar quarto por número
router.put('/quartos/:numero', (req, res) => {
  const { numero } = req.params;
  const { tipo_id, status, descricao, valor_diaria } = req.body;
  if (!tipo_id || !status || !descricao || !valor_diaria) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
  }
  Quartos.update(numero, { tipo_id, status, descricao, valor_diaria }, (err, result) => {
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
      // Erro de integridade referencial (MySQL/MariaDB)
      if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
        return res.status(400).json({ message: 'Não é possível excluir: existem reservas ou consumos ligados a este quarto.' });
      }
      return res.status(500).json({ message: 'Erro ao excluir quarto', error: err });
    }
    res.status(200).json({ message: 'Quarto excluído com sucesso', result });
  });
});

// Chegadas do dia (check-in)
router.get('/checkins-hoje', (req, res) => {
  const hoje = new Date().toISOString().slice(0, 10);
  db.query(
    `SELECT c.cpf, c.nome, q.numero as quarto, tq.tipo as tipo_quarto, 
            r.hora_checkin as hora, c.telefone, c.email, 
            COALESCE(q.valor_diaria, tq.valor_diaria) as valor_diaria,
            r.motivo_hospedagem
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
            r.hora_checkout as hora, c.telefone, c.email, 
            COALESCE(q.valor_diaria, tq.valor_diaria) as valor_diaria
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

router.post('/checkin', (req, res) => {
  const {
    cliente_cpf,
    quarto_numero,
    data_checkin,
    hora_checkin,
    valor_diaria,
    motivo_hospedagem,
    acompanhantes,
    cpfs_acompanhantes,
    data_checkout_prevista,
    hora_checkout_prevista,
    ignorar_reserva_ativa // NOVO: parâmetro opcional
  } = req.body;

  if (!cliente_cpf || !quarto_numero || !data_checkin || !hora_checkin || !valor_diaria) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
  }

  // Verifica se já existe reserva ativa para o quarto
  db.query(
    `SELECT id FROM Reservas WHERE quarto_numero = ? AND status = 'ativo'`,
    [quarto_numero],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao verificar reservas', error: err });
      if (results.length > 0) {
        return res.status(400).json({ message: 'Já existe uma reserva ativa para este quarto.' });
      }

      // Verifica se já existe reserva ativa para o CPF (cliente)
      db.query(
        `SELECT id FROM Reservas WHERE cliente_cpf = ? AND status = 'ativo'`,
        [cliente_cpf],
        (err2, results2) => {
          if (err2) return res.status(500).json({ message: 'Erro ao verificar reservas do cliente', error: err2 });
          if (results2.length > 0 && !ignorar_reserva_ativa) {
            // Cliente já tem reserva ativa, pede confirmação
            return res.status(409).json({ 
              message: 'Este cliente já possui uma reserva ativa. Deseja realizar outra mesmo assim?',
              precisa_confirmar: true
            });
          }

          // Faz o INSERT normalmente
          db.query(
            `INSERT INTO Reservas 
              (cliente_cpf, quarto_numero, data_checkin, hora_checkin, valor_diaria, motivo_hospedagem, acompanhantes, data_checkout_prevista, hora_checkout_prevista, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo')`,
            [
              cliente_cpf,
              quarto_numero,
              data_checkin,
              hora_checkin,
              valor_diaria,
              motivo_hospedagem || null,
              acompanhantes || 0,
              data_checkout_prevista || null,
              hora_checkout_prevista || null
            ],
            (err, result) => {
              if (err) return res.status(500).json({ message: 'Erro ao registrar check-in', error: err });
              db.query(
                `UPDATE Quartos SET status = 'ocupado' WHERE numero = ?`,
                [quarto_numero]
              );
              res.status(201).json({ message: 'Check-in registrado com sucesso', result });
            }
          );
        }
      );
    }
  );
});

// PUT /api/checkout/:id - Registrar check-out
router.put('/checkout/:id', (req, res) => {
  const { id } = req.params;
  const { data_checkout, hora_checkout} = req.body;

  if (!data_checkout || !hora_checkout) {
    return res.status(400).json({ message: 'Preencha data e hora do check-out!' });
  }

  db.query(
    `UPDATE Reservas SET data_checkout = ?, hora_checkout = ?, status = 'finalizado' WHERE id = ?`,
    [data_checkout, hora_checkout, id],
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

// GET /api/reservas?futuras=1&quarto_numero=...
router.get('/reservas', (req, res) => {
  const { futuras, quarto_numero } = req.query;
  let sql = `
    SELECT c.nome, r.quarto_numero as quarto, 
           DATE_FORMAT(r.data_checkin, '%d/%m/%Y') as data_entrada,
           DATE_FORMAT(r.hora_checkin, '%H:%i') as hora_entrada,
           DATE_FORMAT(
             IFNULL(r.data_checkout, r.data_checkout_prevista), '%d/%m/%Y'
           ) as data_saida,
           DATE_FORMAT(
             IFNULL(r.hora_checkout, r.hora_checkout_prevista), '%H:%i'
           ) as hora_saida,
           r.status,
           r.acompanhantes,
           r.motivo_hospedagem,
           r.id
    FROM Reservas r
    JOIN Clientes c ON r.cliente_cpf = c.cpf
  `;
  const params = [];
  const where = [];
  if (futuras === '1') {
    where.push("(r.status = 'ativo' AND IFNULL(r.data_checkout, r.data_checkout_prevista) >= CURDATE())");
  }
  if (quarto_numero) {
    where.push('r.quarto_numero = ?');
    params.push(quarto_numero);
  }
  if (where.length) {
    sql += ' WHERE ' + where.join(' AND ');
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
    `SELECT r.*, c.nome, c.telefone, c.email, c.cep, c.endereco, q.numero as quarto, tq.valor_diaria
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

// Rota para calendário de ocupação dos quartos
router.get('/ocupacao-quartos', (req, res) => {
  db.query(
    `SELECT r.quarto_numero, r.data_checkin, r.data_checkout, c.nome as cliente
     FROM Reservas r
     JOIN Clientes c ON r.cliente_cpf = c.cpf
     WHERE r.status IN ('ativo', 'reservado', 'finalizado')`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar ocupação', error: err });
      res.json(results);
    }
  );
});

// Modelo básico para produtos (adicione em models/models.js)
const Produtos = {
  findAll: (callback) => {
    db.query('SELECT * FROM Produtos', callback);
  },
  create: (data, callback) => {
    db.query(
      'INSERT INTO Produtos (nome, preco_unitario, estoque) VALUES (?, ?, ?)',
      [data.nome, data.preco, data.estoque],
      callback
    );
  },
  delete: (id, callback) => {
    db.query('DELETE FROM Produtos WHERE id = ?', [id], callback);
  }
};

// Rotas para produtos
router.get('/produtos', (req, res) => {
  db.query('SELECT * FROM Produtos', (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar produtos', error: err });
    res.json(results);
  });
});

router.post('/produtos', (req, res) => {
  const { nome, preco, estoque } = req.body;
  if (!nome || !preco || !estoque) {
    return res.status(400).json({ message: 'Preencha todos os campos!' });
  }
  Produtos.create({ nome, preco, estoque }, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao cadastrar produto', error: err });
    res.status(201).json({ message: 'Produto cadastrado com sucesso', result });
  });
});

router.delete('/produtos/:id', (req, res) => {
  Produtos.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao deletar produto', error: err });
    res.status(200).json({ message: 'Produto deletado com sucesso', result });
  });
});

async function realizarCheckout(reservaId, data_checkout, hora_checkout) {
  const resp = await fetch(`/api/checkout/${reservaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data_checkout, hora_checkout })
  });
  if (resp.ok) {
    alert('Checkout realizado com sucesso!');
    // Atualize a tela, redirecione, etc.
  } else {
    alert('Erro ao realizar checkout');
  }
}

// Listar consumos de um quarto
router.get('/consumos/:reserva_id', (req, res) => {
  const { reserva_id } = req.params;
  db.query(
    `SELECT c.*, p.nome as produto_nome 
     FROM Consumos c 
     JOIN Produtos p ON c.produto_id = p.id 
     WHERE c.reserva_id = ?`,
    [reserva_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar consumos', error: err });
      res.json(results);
    }
  );
});

// Adicionar consumo a um quarto
router.post('/consumos', (req, res) => {
  const { reserva_id, produto_id, quantidade, preco_unitario } = req.body;
  if (!reserva_id || !produto_id || !quantidade || !preco_unitario) {
    return res.status(400).json({ message: 'Preencha todos os campos!' });
  }
  db.query(
    'INSERT INTO Consumos (reserva_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
    [reserva_id, produto_id, quantidade, preco_unitario],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erro ao adicionar consumo', error: err });
      res.status(201).json({ message: 'Consumo adicionado', result });
    }
  );
});

// Nova rota para buscar a reserva ativa de um quarto pelo número
router.get('/reserva-ativa-quarto/:numero', (req, res) => {
  const { numero } = req.params;
  db.query(
    `SELECT * FROM Reservas WHERE quarto_numero = ? AND status = 'ativo' ORDER BY id DESC LIMIT 1`,
    [numero],
    (err, results) => {
      if (err || !results.length) return res.status(404).json({ message: 'Nenhuma reserva ativa encontrada' });
      res.json(results[0]);
    }
  );
});

// Listar reservas de um quarto
router.get('/reservas-por-quarto', (req, res) => {
  const { quarto_numero } = req.query;
  if (!quarto_numero) return res.status(400).json({ message: 'Informe o número do quarto' });
  Reservas.findByQuarto(quarto_numero, (err, reservas) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar reservas', error: err });
    res.json(reservas);
  });
});

// Excluir reserva
router.delete('/reservas/:id', (req, res) => {
  Reservas.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir reserva', error: err });
    res.json({ message: 'Reserva excluída com sucesso' });
  });
});

// Listar consumos de uma reserva
router.get('/consumos', (req, res) => {
  const { reserva_id } = req.query;
  if (!reserva_id) return res.status(400).json({ message: 'Informe o id da reserva' });
  Consumos.findByReserva(reserva_id, (err, consumos) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar consumos', error: err });
    res.json(consumos);
  });
});

// Excluir consumo
router.delete('/consumos/:id', (req, res) => {
  Consumos.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir consumo', error: err });
    res.json({ message: 'Consumo excluído com sucesso' });
  });
});

// Novo: Listar hóspedes ativos
router.get('/hospedes-ativos', (req, res) => {
  const sql = `
    SELECT c.cpf, c.nome, r.quarto_numero as quarto, q.tipo as tipo_quarto,
           r.hora_checkin as hora, c.telefone, c.email, r.valor_diaria, r.motivo_hospedagem
    FROM Reservas r
    JOIN Clientes c ON r.cliente_cpf = c.cpf
    JOIN Quartos q ON r.quarto_numero = q.numero
    WHERE r.status = 'ativo'
    ORDER BY r.data_checkin DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar hóspedes ativos', error: err });
    res.json(results);
  });
});

module.exports = router;
