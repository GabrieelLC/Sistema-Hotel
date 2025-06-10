document.addEventListener('DOMContentLoaded', () => {
  // LOGIN
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const usuario = document.getElementById('usuario').value;
      const senha = document.getElementById('senha').value;

      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario, senha }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Login realizado com sucesso!');
        } else {
          alert(data.message || 'Erro ao realizar login');
        }
      } catch (error) {
        alert('Erro ao conectar ao servidor');
      }
    });
  }

  // CADASTRO DE CLIENTE
  const cadastroForm = document.getElementById('cadastroForm');
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nome = document.getElementById('nome').value;
      const cpf = document.getElementById('cpf').value;
      const telefone = document.getElementById('telefone').value;
      const email = document.getElementById('email').value;
      const endereco = document.getElementById('endereco').value;
      const cep = document.getElementById('cep').value;

      try {
        const response = await fetch('http://localhost:3000/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, cpf, telefone, email, endereco, cep }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Cliente cadastrado com sucesso!');
          cadastroForm.reset();
        } else {
          alert(data.message || 'Erro ao cadastrar cliente');
        }
      } catch (error) {
        alert('Erro ao conectar ao servidor');
      }
    });
  }

  async function carregarCheckins() {
    const tbody = document.getElementById('checkin-tbody');
    tbody.innerHTML = '<tr><td colspan="8">Carregando...</td></tr>';
    const resp = await fetch('/api/checkins-hoje');
    const dados = await resp.json();
    if (dados.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8">Nenhum check-in hoje</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    dados.forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td>${item.cpf}</td>
          <td>${item.nome}</td>
          <td>${item.quarto}</td>
          <td>${item.tipo_quarto}</td>
          <td>${item.hora}</td>
          <td>${item.telefone}</td>
          <td>${item.email}</td>
          <td>R$${item.valor_diaria}</td>
        </tr>
      `;
    });
  }

  async function carregarCheckouts() {
    const tbody = document.getElementById('checkout-tbody');
    tbody.innerHTML = '<tr><td colspan="8">Carregando...</td></tr>';
    const resp = await fetch('/api/checkouts-hoje');
    const dados = await resp.json();
    if (dados.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8">Nenhum check-out hoje</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    dados.forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td>${item.cpf}</td>
          <td>${item.nome}</td>
          <td>${item.quarto}</td>
          <td>${item.tipo_quarto}</td>
          <td>${item.hora}</td>
          <td>${item.telefone}</td>
          <td>${item.email}</td>
          <td>R$${item.valor_diaria}</td>
        </tr>
      `;
    });
  }

  carregarCheckins();
  carregarCheckouts();
});