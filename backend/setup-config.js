const db = require('./config/database');

// Script de limpeza: remove estruturas relacionadas à taxa de acompanhante
const steps = [
  {
    sql: 'DROP TABLE IF EXISTS configuracoes_precos',
    success: 'Tabela configuracoes_precos removida (se existia).'
  },
  {
    sql: 'ALTER TABLE Reservas DROP COLUMN taxa_acompanhante',
    success: 'Coluna taxa_acompanhante removida de Reservas.',
    ignoreCodes: ['ER_BAD_FIELD_ERROR', 'ER_CANT_DROP_FIELD_OR_KEY']
  }
];

function runStep(index = 0) {
  if (index >= steps.length) {
    console.log('Limpeza concluída.');
    process.exit(0);
  }

  const step = steps[index];
  db.query(step.sql, (err) => {
    if (err) {
      if (step.ignoreCodes && step.ignoreCodes.includes(err.code)) {
        console.warn(`Aviso: ${err.message} (ignorado)`);
      } else {
        console.error(`Erro na etapa ${index + 1}:`, err);
        process.exit(1);
      }
    } else {
      console.log(step.success);
    }
    runStep(index + 1);
  });
}

runStep();
