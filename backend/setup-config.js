const db = require('./config/database');

// Primeiro, dropar a tabela se existir (para recriar com schema correto)
db.query('DROP TABLE IF EXISTS configuracoes_precos', (err) => {
  if (err) console.error('Erro ao dropar tabela:', err);
  
  const sqlScript = `
  CREATE TABLE configuracoes_precos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    taxa_acompanhante_padrao DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
    descricao VARCHAR(255) DEFAULT 'Taxa de café da manhã por acompanhante',
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    atualizado_por INT,
    FOREIGN KEY (atualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL
  );
  `;

  db.query(sqlScript, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err);
      process.exit(1);
    }
    console.log('✓ Tabela configuracoes_precos criada');

    // Inserir valor padrão
    db.query(
      'INSERT INTO configuracoes_precos (taxa_acompanhante_padrao, descricao) VALUES (?, ?)',
      [50.00, 'Taxa de café da manhã por acompanhante'],
      (err) => {
        if (err) {
          console.error('Erro ao inserir valor padrão:', err);
        } else {
          console.log('✓ Valor padrão (R$ 50.00) inserido');
        }
        // Agora, garantir que a tabela Reservas possua as colunas necessárias
        const alterSql = `
          ALTER TABLE Reservas
          ADD COLUMN IF NOT EXISTS taxa_acompanhante DECIMAL(10,2) NULL,
          ADD COLUMN IF NOT EXISTS valor_diaria_base DECIMAL(10,2) NULL;
        `;

        db.query(alterSql, (alterErr) => {
          if (alterErr) {
            // Alguns MySQLs não suportam IF NOT EXISTS em ADD COLUMN; tentar alternativa
            const alterFallback = `
              ALTER TABLE Reservas ADD COLUMN taxa_acompanhante DECIMAL(10,2) NULL;
            `;
            db.query(alterFallback, (fallbackErr) => {
              // Ignorar erros se coluna já existir
              if (fallbackErr && fallbackErr.code !== 'ER_DUP_FIELDNAME') {
                console.warn('Erro ao adicionar coluna taxa_acompanhante (ignorado):', fallbackErr.message || fallbackErr);
              }
              // Tenta adicionar valor_diaria_base
              db.query(`ALTER TABLE Reservas ADD COLUMN valor_diaria_base DECIMAL(10,2) NULL`, (fb2Err) => {
                if (fb2Err && fb2Err.code !== 'ER_DUP_FIELDNAME') {
                  console.warn('Erro ao adicionar coluna valor_diaria_base (ignorado):', fb2Err.message || fb2Err);
                }
                console.log('Setup finalizado');
                process.exit(0);
              });
            });
          } else {
            console.log('Colunas taxa_acompanhante e valor_diaria_base garantidas em Reservas');
            process.exit(0);
          }
        });
      }
    );
  });
});
