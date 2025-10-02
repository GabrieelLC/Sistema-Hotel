const express = require("express");
const {
  Usuarios,
  Clientes,
  Quartos,
  TiposQuarto,
  Reservas,
  Consumos,
} = require("../models/models");
const db = require("../config/database"); // Certifique-se de que o caminho para o seu arquivo de configuração do banco de dados está correto

const router = express.Router();

router.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  Usuarios.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erro no servidor", error: err });
    }

    const user = results.find((u) => u.usuario === usuario);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (senha !== user.senha) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    res.status(200).json({ message: "Login realizado com sucesso", user });
  });
});

router.get("/clientes", (req, res) => {
  Clientes.findAll((err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao buscar clientes", error: err });
    res.json(results);
  });
});

router.post("/clientes", (req, res) => {
  let { cpf, passaporte, nome, telefone, email, endereco, cep, data_nascimento, nacionalidade } = req.body;

  // Função utilitária para converter string vazia ou nula para NULL do SQL
  const toNull = (value) => (value && String(value).trim() !== "" ? value : null);

  // 1. Validação Obrigatória
  if (!cpf && !passaporte) {
    return res.status(400).json({ message: "Preencha CPF ou Passaporte!" });
  }

  // 2. Aplica o tratamento de NULLs para todos os campos
  const params = [
    toNull(cpf),
    toNull(passaporte),
    nome, // Presumimos que 'nome' é obrigatório (NOT NULL)
    toNull(telefone),
    toNull(email),
    toNull(endereco),
    toNull(cep),
    toNull(data_nascimento),
    toNull(nacionalidade),
  ];

  const sql = `
    INSERT INTO clientes (cpf, passaporte, nome, telefone, email, endereco, cep, data_nascimento, nacionalidade)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar cliente:", err);
      // CORREÇÃO: Trata o erro de duplicidade (ER_DUP_ENTRY: 1062)
      if (err.errno === 1062) {
         // Retorna 409 Conflict para o frontend, que exibirá a mensagem no alert.
         return res.status(409).json({ message: "Erro: CPF ou Passaporte já cadastrado para outro cliente." });
      }
      // Trata outros erros 500 (como problemas de conexão ou de tipagem no DB)
      return res.status(500).json({ message: "Erro interno ao cadastrar cliente. Verifique o console do servidor para detalhes.", error: err });
    }
    res.status(201).json({ message: "Cliente cadastrado com sucesso", result });
  });
});

router.get("/clientes/:id", (req, res) => {
  const { cpf } = req.params;
  Clientes.findByCpf(cpf, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar cliente", error: err });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.status(200).json(result[0]);
  });
});

// Nova rota específica para buscar cliente por passaporte (evita conflito com rota por CPF)
router.get("/clientes/passaporte/:passaporte", (req, res) => {
  const { passaporte } = req.params;
  Clientes.findByPassaporte(passaporte, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar cliente por passaporte", error: err });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.status(200).json(result[0]);
  });
});

router.get("/clientes/cpf/:cpf", (req, res) => {
  const { cpf } = req.params;
  Clientes.findByCpf(cpf, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar cliente por CPF", error: err });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.status(200).json(result[0]);
  });
});

// A rota PUT correta: Atualizar cliente por ID
router.put("/clientes/:id", (req, res) => {
  const id = req.params.id;
  const {
    cpf,
    passaporte,
    nome,
    telefone,
    email,
    endereco,
    cep,
    data_nascimento,
    nacionalidade
  } = req.body;

  // Adicionando validação para garantir que pelo menos um dos identificadores está presente.
  if (!cpf && !passaporte) {
    return res.status(400).json({ message: "O CPF ou Passaporte não pode estar vazio." });
  }

  const sql = `
    UPDATE clientes SET
      cpf = ?,
      passaporte = ?,
      nome = ?,
      telefone = ?,
      email = ?,
      endereco = ?,
      cep = ?,
      data_nascimento = ?,
      nacionalidade = ?
    WHERE id = ?
  `;
  db.query(
    sql,
    [
      cpf,
      passaporte,
      nome,
      telefone,
      email,
      endereco,
      cep,
      data_nascimento,
      nacionalidade,
      id
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar cliente no DB:", err);
        // ER_DUP_ENTRY (1062) - Se CPF/Passaporte for duplicado
        if (err.errno === 1062) {
          return res.status(409).json({ message: "Erro: CPF ou Passaporte já cadastrado para outro cliente." });
        }
        return res.status(500).json({ message: "Erro ao atualizar cliente", error: err });
      }
      
      if (result.affectedRows === 0) {
        // Retorna sucesso se 0 rows afetadas, mas o cliente foi encontrado (pode ser que nenhum dado mudou)
        // O cliente.html confere se response.ok é verdadeiro
        return res.json({ message: "Cliente atualizado com sucesso", result });
      }
      
      res.json({ message: "Cliente atualizado com sucesso", result });
    }
  );
});

// Rota Antiga para deleção por CPF foi removida.
// A rota abaixo é a correta, pois usa o ID do cliente e lida com chaves estrangeiras.

// Novo: Rota para deletar cliente por ID (Acessada pelo frontend/clientes.html)
router.delete("/clientes/:id", (req, res) => {
  const id = req.params.id;
  Clientes.deleteById(id, (err, result) => {
    if (err) {
      // 1451: ER_ROW_IS_REFERENCED_2 (Erro de integridade referencial - Chave Estrangeira)
      if (err.code === "ER_ROW_IS_REFERENCED_2" || err.errno === 1451) {
        return res.status(400).json({ // Retorna 400 Bad Request
          message: "Não é possível excluir o cliente: Existem reservas ou check-ins ativos/anteriores ligados a este registro. Exclua as reservas ou check-ins primeiro.",
          error: err
        });
      }
      return res.status(500).json({ message: "Erro ao deletar cliente", error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.json({ message: "Cliente deletado com sucesso" });
  });
});


// Listar todos os quartos
router.get("/quartos", (req, res) => {
  db.query(
    `SELECT q.numero, tq.tipo, q.tipo_id, q.descricao, 
            COALESCE(q.valor_diaria, tq.valor_diaria) as valor_diaria, 
            q.status
     FROM Quartos q
     JOIN TiposQuarto tq ON q.tipo_id = tq.id`, // Adicionado q.tipo_id aqui
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro ao buscar quartos", error: err });
      res.json(results);
    }
  );
});

// Buscar quarto por número
router.get("/quartos/:numero", (req, res) => {
  const { numero } = req.params;
  Quartos.findByNumero(numero, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar quarto", error: err });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Quarto não encontrado" });
    }
    res.status(200).json(result[0]);
  });
});

// Criar novo quarto
router.post("/quartos", (req, res) => {
  console.log("Dados recebidos no cadastro de quarto:", req.body); // ADICIONE ESTA LINHA
  const { numero, tipo_id, descricao, valor_diaria, status } = req.body;
  if (!numero || !tipo_id || !descricao || !valor_diaria) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos obrigatórios!" });
  }
  Quartos.create(
    { numero, tipo_id, descricao, valor_diaria, status },
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao cadastrar quarto", error: err });
      }
      res
        .status(201)
        .json({ message: "Quarto cadastrado com sucesso", result });
    }
  );
});

// Atualizar quarto por número
router.put("/quartos/:numero", (req, res) => {
  const { numero } = req.params;
  const { tipo_id, status, descricao, valor_diaria } = req.body;
  if (!tipo_id || !status || !descricao || !valor_diaria) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos obrigatórios!" });
  }
  Quartos.update(
    numero,
    { tipo_id, status, descricao, valor_diaria },
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao atualizar quarto", error: err });
      }
      res
        .status(200)
        .json({ message: "Quarto atualizado com sucesso", result });
    }
  );
});

// Deletar quarto por número
router.delete("/quartos/:numero", (req, res) => {
  const { numero } = req.params;
  Quartos.delete(numero, (err, result) => {
    if (err) {
      // Erro de integridade referencial (MySQL/MariaDB)
      if (err.code === "ER_ROW_IS_REFERENCED_2" || err.errno === 1451) {
        return res.status(400).json({
          message:
            "Não é possível excluir: existem reservas ou consumos ligados a este quarto.",
        });
      }
      return res
        .status(500)
        .json({ message: "Erro ao excluir quarto", error: err });
    }
    res.status(200).json({ message: "Quarto excluído com sucesso", result });
  });
});

// Chegadas do dia (check-in)
router.get("/checkins-hoje", (req, res) => {
  const hoje = new Date().toISOString().slice(0, 10);
  db.query(
    `SELECT c.cpf, c.nome, q.numero as quarto, tq.tipo as tipo_quarto, 
            r.hora_checkin as hora, c.telefone, c.email, 
            COALESCE(q.valor_diaria, tq.valor_diaria) as valor_diaria,
            r.motivo_hospedagem
     FROM Reservas r
     JOIN Clientes c ON r.cliente_id = c.id
     JOIN Quartos q ON r.quarto_numero = q.numero
     JOIN TiposQuarto tq ON q.tipo_id = tq.id
     WHERE DATE(r.data_checkin) = ? AND r.status = 'ativo'`,
    [hoje],
    (err, results) => {
      if (err) {
        console.error("Erro ao buscar check-ins:", err);
        return res
          .status(500)
          .json({ message: "Erro ao buscar check-ins", error: err });
      }
      res.json(results);
    }
  );
});

// Saídas do dia (check-out)
router.get("/checkouts-hoje", (req, res) => {
  const hoje = new Date().toISOString().slice(0, 10);
  db.query(
    `SELECT c.cpf, c.nome, q.numero as quarto, tq.tipo as tipo_quarto, 
            r.hora_checkout as hora, c.telefone, c.email, 
            COALESCE(q.valor_diaria, tq.valor_diaria) as valor_diaria,
            r.motivo_hospedagem
     FROM Reservas r
     JOIN Clientes c ON r.cliente_id = c.id
     JOIN Quartos q ON r.quarto_numero = q.numero
     JOIN TiposQuarto tq ON q.tipo_id = tq.id
     WHERE DATE(r.data_checkout) = ?`,
    [hoje],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro ao buscar check-outs", error: err });
      res.json(results);
    }
  );
});

// Listar tipos de quarto
router.get("/tipos-quarto", (req, res) => {
  TiposQuarto.findAll((err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao buscar tipos", error: err });
    res.json(results);
  });
});

// Criar novo tipo de quarto
router.post("/tipos-quarto", (req, res) => {
  const { tipo, descricao, valor_diaria } = req.body;
  TiposQuarto.create({ tipo, descricao, valor_diaria }, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao criar tipo", error: err });
    res.status(201).json({ message: "Tipo criado", result });
  });
});

router.post("/checkin", (req, res) => {
  const {
    cliente_cpf,
    quarto_numero,
    data_checkin,
    hora_checkin,
    valor_diaria,
    motivo_hospedagem,
    nomes_acompanhantes,
    cpfs_acompanhantes,
    nascimentos_acompanhantes,
    data_checkout_prevista,
    hora_checkout_prevista,
    ignorar_reserva_ativa,
  } = req.body;

  if (
    !cliente_cpf || // O CPF/Passaporte preenchido deve ser tratado no frontend antes
    !quarto_numero ||
    !data_checkin ||
    !hora_checkin ||
    !valor_diaria
  ) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos obrigatórios!" });
  }
  
  // CORREÇÃO: PASSO 1: Buscar o ID do cliente a partir do CPF
  db.query(
    `SELECT id FROM Clientes WHERE cpf = ? OR passaporte = ?`,
    [cliente_cpf, cliente_cpf], // Tenta buscar por CPF e Passaporte (caso o frontend coloque o passaporte no campo CPF)
    (idErr, idResults) => {
      if (idErr) {
        console.error("Erro ao buscar ID do cliente:", idErr);
        return res.status(500).json({ message: "Erro interno ao buscar dados do cliente.", error: idErr });
      }
      if (idResults.length === 0) {
        return res.status(404).json({ message: "Cliente não encontrado. Certifique-se de que o CPF/Passaporte está cadastrado." });
      }
      const cliente_id = idResults[0].id; // ID do cliente obtido

      // PASSO 2: Verificar reserva ativa para o quarto
      db.query(
        `SELECT id FROM Reservas WHERE quarto_numero = ? AND status = 'ativo'`,
        [quarto_numero],
        (err, results) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Erro ao verificar reservas do quarto", error: err });
          if (results.length > 0) {
            return res
              .status(400)
              .json({ message: "Já existe uma reserva ativa para este quarto." });
          }

          // PASSO 3: Verificar reserva ativa para o cliente (AGORA USANDO CLIENTE_ID)
          db.query(
            `SELECT id FROM Reservas WHERE cliente_id = ? AND status = 'ativo'`,
            [cliente_id],
            (err2, results2) => {
              if (err2)
                return res.status(500).json({
                  message: "Erro ao verificar reservas do cliente",
                  error: err2,
                });
              if (results2.length > 0 && !ignorar_reserva_ativa) {
                return res.status(409).json({
                  message:
                    "Este cliente já possui uma reserva ativa. Deseja realizar outra mesmo assim?",
                  precisa_confirmar: true,
                });
              }

              // PASSO 4: Inserir a nova reserva (AGORA USANDO CLIENTE_ID)
              db.query(
                `INSERT INTO Reservas 
     (cliente_id, quarto_numero, data_checkin, hora_checkin, valor_diaria, motivo_hospedagem, data_checkout_prevista, hora_checkout_prevista, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ativo')`,
                [
                  cliente_id, // CORREÇÃO: Usar cliente_id
                  quarto_numero,
                  data_checkin,
                  hora_checkin,
                  valor_diaria,
                  motivo_hospedagem || null,
                  data_checkout_prevista || null,
                  hora_checkout_prevista || null,
                ],
                (err, result) => {
                  if (err) {
                    console.error("Erro ao registrar check-in:", err);
                    return res
                      .status(500)
                      .json({ message: "Erro ao registrar check-in", error: err });
                  }

                  const reservaId = result.insertId;

                  db.query(
                    `UPDATE Quartos SET status = 'ocupado' WHERE numero = ?`,
                    [quarto_numero],
                    (err2) => {
                      if (err2)
                        return res.status(500).json({
                          message: "Erro ao atualizar status do quarto",
                          error: err2,
                        });

                      // Verifica se existem acompanhantes para registrar
                      if (nomes_acompanhantes && nomes_acompanhantes.length > 0) {
                        const acompanhantesData = nomes_acompanhantes.map(
                          (nome, index) => [
                            reservaId,
                            nome,
                            cpfs_acompanhantes[index] || null, // Pega o CPF correspondente
                            nascimentos_acompanhantes[index] || null, // Pega a data de nascimento correspondente
                          ]
                        );
                        db.query(
                          `INSERT INTO Acompanhantes (reserva_id, nome, cpf, data_nascimento) VALUES ?`,
                          [acompanhantesData],
                          (err3) => {
                            if (err3) {
                              console.error("Erro ao registrar acompanhantes:", err3);
                              return res.status(500).json({
                                message: "Erro ao registrar acompanhantes",
                                error: err3,
                              });
                            }
                            res.status(201).json({
                              message: "Check-in registrado com sucesso",
                              result,
                            });
                          }
                        );
                      } else {
                        res.status(201).json({
                          message: "Check-in registrado com sucesso",
                          result,
                        });
                      }
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

// PUT /api/checkout/:id - Registrar check-out
router.put("/checkout/:id", (req, res) => {
  const { id } = req.params;
  const { data_checkout, hora_checkout } = req.body;

  if (!data_checkout || !hora_checkout) {
    return res
      .status(400)
      .json({ message: "Preencha data e hora do check-out!" });
  }

  db.query(
    `UPDATE Reservas SET data_checkout = ?, hora_checkout = ?, status = 'finalizado' WHERE id = ?`,
    [data_checkout, hora_checkout, id],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao registrar check-out", error: err });
      }
      // Atualize o status do quarto
      db.query(
        `UPDATE Quartos SET status = 'disponivel' WHERE numero = (SELECT quarto_numero FROM Reservas WHERE id = ?)`,
        [id],
        (err2) => {
          if (err2) {
            return res.status(500).json({
              message: "Erro ao atualizar status do quarto",
              error: err2,
            });
          }
          res
            .status(200)
            .json({ message: "Check-out registrado com sucesso", result });
        }
      );
    }
  );
});

// GET /api/reservas?futuras=1&quarto_numero=...
router.get("/reservas", (req, res) => {
  const { futuras, quarto_numero } = req.query;
  let sql = `
    SELECT c.nome, 
           r.quarto_numero as quarto, 
           DATE_FORMAT(r.data_checkin, '%d/%m/%Y') as data_entrada,
           DATE_FORMAT(r.hora_checkin, '%H:%i') as hora_entrada,
           DATE_FORMAT(IFNULL(r.data_checkout, r.data_checkout_prevista), '%d/%m/%Y') as data_saida,
           DATE_FORMAT(IFNULL(r.hora_checkout, r.hora_checkout_prevista), '%H:%i') as hora_saida,
           r.status,
           r.motivo_hospedagem,
           r.id,
           (SELECT COUNT(*) FROM Acompanhantes WHERE reserva_id = r.id) AS num_acompanhantes,
           (SELECT COALESCE(JSON_ARRAYAGG(
             JSON_OBJECT('nome', nome, 'cpf', cpf, 'data_nascimento', data_nascimento)
           ), '[]') FROM Acompanhantes WHERE reserva_id = r.id) AS acompanhantes
    FROM Reservas r
    JOIN Clientes c ON r.cliente_id = c.id
  `;
  let params = [];
  let conditions = [];

  if (futuras) {
    conditions.push(`r.data_checkout_prevista >= CURDATE() AND r.status = 'ativo'`);
  }

  if (quarto_numero) {
    conditions.push(`r.quarto_numero = ?`);
    params.push(quarto_numero);
  }
  
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  sql += ' GROUP BY r.id ORDER BY r.data_checkin DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar reservas", error: err });
    }
    // O MySQL retorna o campo JSON como uma string, então precisamos convertê-lo
    const parsedResults = results.map(row => ({
        ...row,
        acompanhantes: JSON.parse(row.acompanhantes)
    }));
    res.json(parsedResults);
  });
});

// GET /api/reserva-ativa/:cpf
router.get("/reserva-ativa/:cpf", (req, res) => {
  const cpf = req.params.cpf;
  db.query(
    `SELECT r.*, c.nome, c.telefone, c.email, c.cep, c.endereco, q.numero as quarto, tq.valor_diaria
     FROM Reservas r
     JOIN Clientes c ON r.cliente_id = c.id
     JOIN Quartos q ON r.quarto_numero = q.numero
     JOIN TiposQuarto tq ON q.tipo_id = tq.id
     WHERE r.cliente_cpf = ? AND r.status = 'ativo'
     ORDER BY r.data_checkin DESC LIMIT 1`,
    [cpf],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro ao buscar reserva", error: err });
      if (!results.length)
        return res
          .status(404)
          .json({ message: "Nenhuma reserva ativa encontrada" });
      res.json(results[0]);
    }
  );
});

/*rota antiga para buscar reservas ativas de um cliente
// Rota para calendário de ocupação dos quartos
router.get("/ocupacao-quartos", (req, res) => {
  db. 
    `SELECT r.quarto_numero, r.data_checkin, r.data_checkout, c.nome as cliente
     FROM Reservas r
     JOIN Clientes c ON r.cliente_cpf = c.cpf
     WHERE r.status IN ('ativo', 'reservado', 'finalizado')`,
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro ao buscar ocupação", error: err });
      res.json(results);
    }
  );
});
*/

// Rota para calendário de ocupação dos quartos
router.get("/ocupacao-quartos", (req, res) => {
  const { inicio, fim } = req.query;
  if (!inicio || !fim) {
    return res.status(400).json({ message: "É necessário fornecer data de início e fim." });
  }

  const sql = `
    SELECT 
      r.quarto_numero, 
      r.data_checkin, 
      IFNULL(r.data_checkout, r.data_checkout_prevista) as data_saida,
      c.nome as cliente
    FROM Reservas r
    JOIN Clientes c ON r.cliente_id = c.id
    WHERE 
      r.status IN ('ativo', 'finalizado') AND
      -- Lógica para encontrar reservas que se sobrepõem ao período solicitado:
      -- A reserva começa antes do fim do período E a reserva termina depois do início do período
      r.data_checkin <= ? AND 
      IFNULL(r.data_checkout, r.data_checkout_prevista) >= ?
  `;

  db.query(sql, [fim, inicio], (err, results) => {
    if (err) {
      console.error("Erro na busca de ocupação:", err);
      return res.status(500).json({ message: "Erro ao buscar ocupação", error: err });
    }
    res.json(results);
  });
});

// Modelo básico para produtos (adicione em models/models.js)
const Produtos = {
  findAll: (callback) => {
    db.query("SELECT * FROM Produtos", callback);
  },
  create: (data, callback) => {
    db.query(
      "INSERT INTO Produtos (nome, preco_unitario, estoque) VALUES (?, ?, ?)",
      [data.nome, data.preco, data.estoque],
      callback
    );
  },
  delete: (id, callback) => {
    db.query("DELETE FROM Produtos WHERE id = ?", [id], callback);
  },
};

// Rotas para produtos
router.get("/produtos", (req, res) => {
  db.query("SELECT * FROM Produtos", (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao buscar produtos", error: err });
    res.json(results);
  });
});

router.post("/produtos", (req, res) => {
  const { nome, preco, estoque } = req.body;
  if (!nome || !preco || !estoque) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }
  Produtos.create({ nome, preco, estoque }, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao cadastrar produto", error: err });
    res.status(201).json({ message: "Produto cadastrado com sucesso", result });
  });
});

router.delete("/produtos/:id", (req, res) => {
  Produtos.delete(req.params.id, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao deletar produto", error: err });
    res.status(200).json({ message: "Produto deletado com sucesso", result });
  });
});

async function realizarCheckout(reservaId, data_checkout, hora_checkout) {
  const resp = await fetch(`/api/checkout/${reservaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data_checkout, hora_checkout }),
  });
  if (resp.ok) {
    alert("Checkout realizado com sucesso!");
    // Atualize a tela, redirecione, etc.
  } else {
    alert("Erro ao realizar checkout");
  }
}

// Listar consumos de um quarto
router.get("/consumos/:reserva_id", (req, res) => {
  const { reserva_id } = req.params;
  db.query(
    `SELECT c.*, p.nome as produto_nome 
     FROM Consumos c 
     JOIN Produtos p ON c.produto_id = p.id 
     WHERE c.reserva_id = ?`,
    [reserva_id],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro ao buscar consumos", error: err });
      res.json(results);
    }
  );
});

// Adicionar consumo a um quarto
router.post("/consumos", (req, res) => {
  const { reserva_id, produto_id, quantidade, preco_unitario } = req.body;
  if (!reserva_id || !produto_id || !quantidade || !preco_unitario) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }
  db.query(
    "INSERT INTO Consumos (reserva_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
    [reserva_id, produto_id, quantidade, preco_unitario],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro ao adicionar consumo", error: err });
      res.status(201).json({ message: "Consumo adicionado", result });
    }
  );
});

// Nova rota para buscar a reserva ativa de um quarto pelo número
router.get("/reserva-ativa-quarto/:numero", (req, res) => {
  const { numero } = req.params;
  db.query(
    `SELECT r.*, c.nome as nome_cliente 
     FROM Reservas r
     JOIN Clientes c ON r.cliente_id = c.id
     WHERE r.quarto_numero = ? AND r.status = 'ativo' 
     ORDER BY r.id DESC LIMIT 1`,
    [numero],
    (err, results) => {
      if (err || !results.length)
        return res
          .status(404)
          .json({ message: "Nenhuma reserva ativa encontrada" });
      res.json(results[0]);
    }
  );
});

// Listar reservas de um quarto
router.get("/reservas-por-quarto", (req, res) => {
  const { quarto_numero } = req.query;
  if (!quarto_numero)
    return res.status(400).json({ message: "Informe o número do quarto" });
  Reservas.findByQuarto(quarto_numero, (err, reservas) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao buscar reservas", error: err });
    res.json(reservas);
  });
});

// Excluir reserva
router.delete("/reservas/:id", (req, res) => {
  Reservas.delete(req.params.id, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao excluir reserva", error: err });
    res.json({ message: "Reserva excluída com sucesso" });
  });
});

// Listar consumos de uma reserva
router.get("/consumos", (req, res) => {
  const { reserva_id } = req.query;
  if (!reserva_id)
    return res.status(400).json({ message: "Informe o id da reserva" });
  Consumos.findByReserva(reserva_id, (err, consumos) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao buscar consumos", error: err });
    res.json(consumos);
  });
});

// Excluir consumo
router.delete("/consumos/:id", (req, res) => {
  Consumos.delete(req.params.id, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao excluir consumo", error: err });
    res.json({ message: "Consumo excluído com sucesso" });
  });
});

// Novo: Listar hóspedes ativos
router.get("/hospedes-ativos", (req, res) => {
  const sql = `
    SELECT c.cpf, c.nome, r.quarto_numero as quarto, tq.tipo as tipo_quarto,
           r.hora_checkin as hora, c.telefone, c.email, r.valor_diaria, 
           r.motivo_hospedagem
    FROM Reservas r
    JOIN Clientes c ON r.cliente_id = c.id
    JOIN Quartos q ON r.quarto_numero = q.numero
    JOIN TiposQuarto tq ON q.tipo_id = tq.id 
    WHERE r.status = 'ativo'
    ORDER BY r.data_checkin DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar hóspedes ativos:", err);
      return res
        .status(500)
        .json({ message: "Erro ao buscar hóspedes ativos", error: err });
    }
    res.json(results);
  });
});

router.get("/api/checkouts-hoje", (req, res) => {
  const sql = `
    SELECT c.cpf, c.nome, r.quarto_numero as quarto, q.tipo as tipo_quarto,
           r.hora_checkout as hora, c.telefone, c.email, r.valor_diaria, 
           r.motivo_hospedagem
    FROM Reservas r
    JOIN Clientes c ON r.cliente_id = c.id
    JOIN Quartos q ON r.quarto_numero = q.numero
    WHERE r.status = 'finalizado' AND r.data_checkout = CURDATE()
    ORDER BY r.hora_checkout ASC
  `;
  db.query(sql, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao buscar checkouts", error: err });
    res.json(results);
  });
});

// Rota para buscar check-outs vencidos
router.get("/checkouts-vencidos", (req, res) => {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const hora = String(agora.getHours()).padStart(2, '0');
  const minuto = String(agora.getMinutes()).padStart(2, '0');
  const segundo = String(agora.getSeconds()).padStart(2, '0');
  const dataHoraAtual = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

  const sql = `
    SELECT c.cpf, c.nome, r.quarto_numero as quarto, tq.tipo as tipo_quarto,
           DATE_FORMAT(r.data_checkout_prevista, '%d/%m/%Y') as data_saida_prevista,
           DATE_FORMAT(r.hora_checkout_prevista, '%H:%i') as hora_saida_prevista,
           c.telefone, c.email
    FROM Reservas r
    JOIN Clientes c ON r.cliente_id = c.id
    JOIN Quartos q ON r.quarto_numero = q.numero
    JOIN TiposQuarto tq ON q.tipo_id = tq.id 
    WHERE r.status = 'ativo' AND CONCAT(r.data_checkout_prevista, ' ', r.hora_checkout_prevista) < ?
    ORDER BY r.data_checkout_prevista, r.hora_checkout_prevista ASC
  `;

  db.query(sql, [dataHoraAtual], (err, results) => {
    if (err) {
      console.error("Erro ao buscar check-outs vencidos:", err);
      return res.status(500).json({ message: "Erro ao buscar check-outs vencidos", error: err });
    }
    res.json(results);
  });
});

// Função utilitária para buscar cliente por CPF ou passaporte
function buscarCliente({ cpf, passaporte }, callback) {
  let sql = "SELECT * FROM Clientes WHERE ";
  let params = [];
  if (cpf) {
    sql += "cpf = ?";
    params.push(cpf);
  } else if (passaporte) {
    sql += "passaporte = ?";
    params.push(passaporte);
  } else {
    return callback(new Error("Informe CPF ou passaporte"));
  }
  db.query(sql, params, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
}

// Rota para criar reserva usando cliente_id
router.post("/reservas", (req, res) => {
  const {
    cpf,
    passaporte,
    quarto_numero,
    data_checkin,
    hora_checkin,
    valor_diaria,
    motivo_hospedagem,
    data_checkout_prevista,
    hora_checkout_prevista,
    desconto,
    status
  } = req.body;

  buscarCliente({ cpf, passaporte }, (err, cliente) => {
    if (err || !cliente) return res.status(400).json({ message: "Cliente não encontrado" });

    db.query(
      `INSERT INTO Reservas (
        quarto_numero, cliente_id, data_checkin, hora_checkin, valor_diaria, motivo_hospedagem, data_checkout_prevista, hora_checkout_prevista, desconto, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quarto_numero,
        cliente.id,
        data_checkin,
        hora_checkin,
        valor_diaria,
        motivo_hospedagem || null,
        data_checkout_prevista || null,
        hora_checkout_prevista || null,
        desconto || 0,
        status || 'ativo'
      ],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao criar reserva", error: err });
        res.status(201).json({ message: "Reserva criada com sucesso", result });
      }
    );
  });
});

// Novo: Atualizar cliente por ID
router.put("/api/clientes/:id", (req, res) => {
  const id = req.params.id;
  const {
    cpf,
    passaporte,
    nome,
    telefone,
    email,
    endereco,
    cep,
    data_nascimento,
    nacionalidade
  } = req.body;

  const sql = `
    UPDATE clientes SET
      cpf = ?,
      passaporte = ?,
      nome = ?,
      telefone = ?,
      email = ?,
      endereco = ?,
      cep = ?,
      data_nascimento = ?,
      nacionalidade = ?
    WHERE id = ?
  `;
  db.query(
    sql,
    [
      cpf,
      passaporte,
      nome,
      telefone,
      email,
      endereco,
      cep,
      data_nascimento,
      nacionalidade,
      id
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar cliente:", err);
        return res.status(500).json({ message: "Erro ao atualizar cliente", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      res.json({ message: "Cliente atualizado com sucesso", result });
    }
  );
});

router.get("/api/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao buscar clientes", error: err });
    res.json(results);
  });
});


module.exports = router;