/**
 * test-auth.js - Teste rápido de autenticação e rotas
 */

async function test() {
  console.log('🔐 [1] Testando login...');
  try {
    const loginRes = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: 'admin', senha: 'admin' })
    });
    const loginData = await loginRes.json();
    
    if (!loginRes.ok) {
      console.log('❌ Login falhou:', loginData.message);
      return;
    }
    
    console.log('✅ Login bem-sucedido. Token:', loginData.token.substring(0, 30) + '...');
    const token = loginData.token;

    // Teste checkins-hoje
    console.log('\n📥 [2] Testando /api/checkins-hoje...');
    const checkinsRes = await fetch('http://localhost:3000/api/checkins-hoje', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const checkins = await checkinsRes.json();
    console.log('✅ Resposta:', checkinsRes.status, '- Registros:', checkins.length || checkins.message);

    // Teste checkouts-hoje
    console.log('\n📤 [3] Testando /api/checkouts-hoje...');
    const checkoutsRes = await fetch('http://localhost:3000/api/checkouts-hoje', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const checkouts = await checkoutsRes.json();
    console.log('✅ Resposta:', checkoutsRes.status, '- Registros:', checkouts.length || checkouts.message);

    // Teste hospedes-ativos
    console.log('\n🏨 [4] Testando /api/hospedes-ativos...');
    const hospedesRes = await fetch('http://localhost:3000/api/hospedes-ativos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const hospedes = await hospedesRes.json();
    console.log('✅ Resposta:', hospedesRes.status, '- Registros:', hospedes.length || hospedes.message);

    // Teste checkouts-vencidos
    console.log('\n⚠️  [5] Testando /api/checkouts-vencidos...');
    const vencidosRes = await fetch('http://localhost:3000/api/checkouts-vencidos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const vencidos = await vencidosRes.json();
    console.log('✅ Resposta:', vencidosRes.status, '- Registros:', vencidos.length || vencidos.message);

    console.log('\n✅ Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

test();
