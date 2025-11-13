const db = require('./config/database');

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar:', err);
    process.exit(1);
  }

  console.log('Conectado ao banco. Alterando tabela usuarios...');

  const sql = `ALTER TABLE usuarios MODIFY COLUMN nivel_acesso enum('admin','gerente','padrão') DEFAULT 'padrão'`;

  db.query(sql, (err) => {
    if (err) {
      console.error('Erro ao alterar tabela:', err.message);
      process.exit(1);
    }
    console.log('✅ Tabela usuarios alterada com sucesso!');
    process.exit(0);
  });
});
