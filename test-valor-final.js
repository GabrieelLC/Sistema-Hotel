#!/usr/bin/env node

/**
 * Test para verificar se GET /api/reserva-ativa/:cpf retorna valor_diaria_final corretamente
 */

async function testValorFinal() {
  try {
    console.log('🧪 Testando GET /api/reserva-ativa/:cpf\n');

    // 1. Fazer login para obter token
    console.log('1️⃣  Fazendo login...');
    const loginResp = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: 'admin', senha: 'admin' })
    });
    
    if (!loginResp.ok) {
      console.error('❌ Erro ao fazer login:', await loginResp.text());
      return;
    }

    const loginData = await loginResp.json();
    const token = loginData.token;
    console.log('✅ Login realizado com sucesso!\n');

    // 2. Testar GET /api/reserva-ativa com um CPF (precisamos de um CPF de uma reserva ativa)
    // Vamos tentar com um CPF comum para teste
    const testCPF = '03732264114'; // CPF do Gabriel Liduino (do screenshot)
    
    console.log(`2️⃣  Buscando reserva ativa para CPF: ${testCPF}...`);
    const reservaResp = await fetch(`http://localhost:3000/api/reserva-ativa/${testCPF}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!reservaResp.ok) {
      console.log(`⚠️  Nenhuma reserva ativa para ${testCPF} (normal se não há reservas ativas)\n`);
      
      // Vamos buscar todas as reservas ativas e testar com uma delas
      console.log(`3️⃣  Buscando todas as reservas ativas...`);
      const reservasResp = await fetch('http://localhost:3000/api/reservas?futuras=1', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!reservasResp.ok) {
        console.error('❌ Erro ao buscar reservas:', await reservasResp.text());
        return;
      }

      const reservas = await reservasResp.json();
      
      if (reservas.length === 0) {
        console.log('⚠️  Nenhuma reserva ativa encontrada. Teste incompleto.');
        return;
      }

      console.log(`✅ Encontradas ${reservas.length} reservas ativas\n`);

      // Testar com a primeira reserva
      const primeiraReserva = reservas[0];
      const cpfTeste = primeiraReserva.cliente_cpf;
      
      console.log(`4️⃣  Testando GET /api/reserva-ativa/${cpfTeste}...`);
      const reservaRes = await fetch(`http://localhost:3000/api/reserva-ativa/${cpfTeste}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!reservaRes.ok) {
        console.error('❌ Erro ao buscar reserva:', await reservaRes.text());
        return;
      }

      const reserva = await reservaRes.json();
      
      console.log('✅ Reserva obtida com sucesso!\n');
      console.log('📋 Dados da Reserva:');
      console.log(`   - ID: ${reserva.id}`);
      console.log(`   - Cliente: ${reserva.nome}`);
      console.log(`   - Quarto: ${reserva.quarto}`);
      console.log(`   - valor_diaria: R$ ${reserva.valor_diaria}`);
      console.log(`   - valor_diaria_base: R$ ${reserva.valor_diaria_base}`);
      console.log(`   - valor_diaria_final: R$ ${reserva.valor_diaria_final}`);
      console.log(`   - taxa_acompanhante: ${reserva.taxa_acompanhante ? `R$ ${reserva.taxa_acompanhante}` : 'nenhuma'}`);
      console.log(`   - acompanhantes_count: ${reserva.acompanhantes_count}`);
      console.log(`   - total_taxa_aplicada: R$ ${reserva.total_taxa_aplicada}\n`);

      if (!reserva.valor_diaria_final) {
        console.error('❌ PROBLEMA: valor_diaria_final não foi retornado!');
      } else {
        console.log('✅ SUCESSO: valor_diaria_final foi retornado corretamente!');
      }

      return;
    }

    const reserva = await reservaResp.json();
    console.log('✅ Reserva obtida com sucesso!\n');
    console.log('📋 Dados da Reserva:');
    console.log(`   - ID: ${reserva.id}`);
    console.log(`   - Cliente: ${reserva.nome}`);
    console.log(`   - Quarto: ${reserva.quarto}`);
    console.log(`   - valor_diaria: R$ ${reserva.valor_diaria}`);
    console.log(`   - valor_diaria_base: R$ ${reserva.valor_diaria_base}`);
    console.log(`   - valor_diaria_final: R$ ${reserva.valor_diaria_final}`);
    console.log(`   - taxa_acompanhante: ${reserva.taxa_acompanhante ? `R$ ${reserva.taxa_acompanhante}` : 'nenhuma'}`);
    console.log(`   - acompanhantes_count: ${reserva.acompanhantes_count}`);
    console.log(`   - total_taxa_aplicada: R$ ${reserva.total_taxa_aplicada}\n`);

    if (!reserva.valor_diaria_final) {
      console.error('❌ PROBLEMA: valor_diaria_final não foi retornado!');
    } else {
      console.log('✅ SUCESSO: valor_diaria_final foi retornado corretamente!');
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testValorFinal();
