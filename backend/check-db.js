const db = require('./config/database');

async function run() {
  try {
    console.log('Descrição da tabela Reservas (colunas de valor):');
    db.query('DESCRIBE Reservas', (err2, descr) => {
      if (err2) {
        console.error('Erro ao descrever Reservas:', err2);
      } else {
        const cols = descr.filter(c => ['valor_diaria_base','valor_diaria'].includes(c.Field));
        console.table(cols.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null, Key: c.Key, Default: c.Default }))); 
      }

      console.log('\nExemplo de registro na tabela Reservas:');
      db.query('SELECT id, valor_diaria, valor_diaria_base FROM Reservas ORDER BY id DESC LIMIT 1', (err3, rows) => {
        if (err3) {
          console.error('Erro ao ler Reservas:', err3.code ? err3.code + ' - ' + err3.sqlMessage : err3);
        } else if (!rows || !rows.length) {
          console.log('Nenhuma reserva encontrada');
        } else {
          console.log(rows[0]);
        }

        process.exit(0);
      });
    });
  } catch (e) {
    console.error('Erro geral:', e);
    process.exit(1);
  }
}

run();
