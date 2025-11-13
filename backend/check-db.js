const db = require('./config/database');

async function run() {
  try {
    console.log('Verificando existência da tabela configuracoes_precos...');
    db.query("SHOW TABLES LIKE 'configuracoes_precos'", (err, tables) => {
      if (err) {
        console.error('Erro ao checar tabelas:', err);
      } else {
        console.log('Resultado SHOW TABLES LIKE configuracoes_precos:', tables.length ? tables : 'não encontrada');
      }

      console.log('\nDescrição da tabela Reservas (colunas relevantes):');
      db.query('DESCRIBE Reservas', (err2, descr) => {
        if (err2) {
          console.error('Erro ao descrever Reservas:', err2);
        } else {
          const cols = descr.filter(c => ['taxa_acompanhante','valor_diaria_base','valor_diaria'].includes(c.Field));
          console.table(cols.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null, Key: c.Key, Default: c.Default }))); 
        }

        console.log('\nExemplo de registro na configuracoes_precos:');
        db.query('SELECT * FROM configuracoes_precos ORDER BY id DESC LIMIT 1', (err3, rows) => {
          if (err3) {
            console.error('Erro ao ler configuracoes_precos:', err3.code ? err3.code + ' - ' + err3.sqlMessage : err3);
          } else if (!rows || !rows.length) {
            console.log('Nenhum registro em configuracoes_precos encontrado');
          } else {
            console.log(rows[0]);
          }

          process.exit(0);
        });
      });
    });
  } catch (e) {
    console.error('Erro geral:', e);
    process.exit(1);
  }
}

run();
