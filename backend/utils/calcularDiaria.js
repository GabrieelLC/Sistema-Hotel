/**
 * Calcula o valor da diária baseado no número de acompanhantes.
 * Cada acompanhante adiciona uma TAXA FIXA de café da manhã.
 * 
 * @param {object} db - conexão do banco
 * @param {number} reservaId - ID da reserva
 * @param {number} valorBase - valor base da diária (sem acompanhantes)
 * @param {number} taxaAcompanhante - taxa por acompanhante (opcional, busca do banco se omitido)
 * 
 * Retorna: { acompanhantes, taxa_acompanhante, valorBase, valorFinal, total_taxa_aplicada }
 */
async function calcularDiariaComAcompanhantes(db, reservaId, valorBase, taxaAcompanhante = null) {
  return new Promise((resolve, reject) => {
    // Contar acompanhantes da reserva
    db.query(
      "SELECT COUNT(*) as total FROM Acompanhantes WHERE reserva_id = ?",
      [reservaId],
      (err, results) => {
        if (err) return reject(err);

        const totalAcompanhantes = (results && results[0] && results[0].total) ? results[0].total : 0;

        // Se taxa não foi informada, buscar do banco
        if (taxaAcompanhante === null) {
          db.query(
            "SELECT taxa_acompanhante_padrao FROM configuracoes_precos ORDER BY id DESC LIMIT 1",
            (cfgErr, cfgResults) => {
              if (cfgErr || !cfgResults || !cfgResults.length) {
                console.warn("Aviso: usando taxa padrão de R$ 50.00");
                taxaAcompanhante = 50.00;
              } else {
                taxaAcompanhante = Number(cfgResults[0].taxa_acompanhante_padrao) || 50.00;
              }

              const totalTaxaAplicada = totalAcompanhantes * taxaAcompanhante;
              const valorFinal = Number(valorBase) + totalTaxaAplicada;

              resolve({
                acompanhantes: totalAcompanhantes,
                taxa_acompanhante: Number(taxaAcompanhante.toFixed(2)),
                valorBase: Number(valorBase),
                valorFinal: Number(valorFinal.toFixed(2)),
                total_taxa_aplicada: Number(totalTaxaAplicada.toFixed(2))
              });
            }
          );
        } else {
          const totalTaxaAplicada = totalAcompanhantes * taxaAcompanhante;
          const valorFinal = Number(valorBase) + totalTaxaAplicada;

          resolve({
            acompanhantes: totalAcompanhantes,
            taxa_acompanhante: Number(taxaAcompanhante),
            valorBase: Number(valorBase),
            valorFinal: Number(valorFinal.toFixed(2)),
            total_taxa_aplicada: Number(totalTaxaAplicada.toFixed(2))
          });
        }
      }
    );
  });
}

/**
 * Atualiza o valor da diária de uma reserva baseado em acompanhantes
 */
async function atualizarDiariaReserva(db, reservaId, valorBase, taxaAcompanhante = null) {
  try {
    const calculo = await calcularDiariaComAcompanhantes(
      db,
      reservaId,
      valorBase,
      taxaAcompanhante
    );

    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE Reservas SET valor_diaria = ? WHERE id = ?',
        [calculo.valorFinal, reservaId],
        (err) => {
          if (err) return reject(err);
          resolve(calculo);
        }
      );
    });
  } catch (e) {
    throw e;
  }
}

module.exports = {
  calcularDiariaComAcompanhantes,
  atualizarDiariaReserva
};
