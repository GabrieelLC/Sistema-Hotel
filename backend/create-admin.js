/**
 * Script para criar usuário admin de teste
 * Execute: node create-admin.js
 */

const db = require('./config/database');

const adminUser = {
  usuario: 'admin',
  senha: 'admin', // Senha de teste
  nome: 'Administrador',
  nivel_acesso: 'admin'
};

const sql = `
  INSERT INTO usuarios (usuario, senha, nome, nivel_acesso)
  VALUES (?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
  senha = ?, nome = ?, nivel_acesso = ?
`;

db.query(
  sql,
  [
    adminUser.usuario,
    adminUser.senha,
    adminUser.nome,
    adminUser.nivel_acesso,
    adminUser.senha,
    adminUser.nome,
    adminUser.nivel_acesso
  ],
  (err, result) => {
    if (err) {
      console.error('Erro ao criar usuário:', err);
      process.exit(1);
    }
    console.log('✅ Usuário admin criado/atualizado com sucesso!');
    console.log('Usuário: admin');
    console.log('Senha: admin');
    process.exit(0);
  }
);
