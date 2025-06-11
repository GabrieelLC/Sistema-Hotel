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
          carregarClientes && carregarClientes(); // Atualiza a tabela se estiver na página de clientes
        } else {
          alert(data.message || 'Erro ao cadastrar cliente');
        }
      } catch (error) {
        alert('Erro ao conectar ao servidor');
      }
    });
  }

  // CADASTRO DE QUARTO DINÂMICO
  async function carregarTiposQuarto() {
    const select = document.getElementById('tipo_id');
    if (!select) return;
    const resp = await fetch('http://localhost:3000/api/tipos-quarto');
    const tipos = await resp.json();
    select.innerHTML = tipos.map(t => `<option value="${t.id}">${t.tipo}</option>`).join('');
  }
  carregarTiposQuarto();

  const cadastroQuartoForm = document.getElementById('cadastroQuartoForm');
  if (cadastroQuartoForm) {
    cadastroQuartoForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const tipo_id = document.getElementById('tipo_id').value;
      const numero = document.getElementById('numero').value;
      const status = 'disponivel';

      try {
        const response = await fetch('http://localhost:3000/api/quartos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            numero,
            tipo_id,
            status
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Quarto cadastrado com sucesso!');
          cadastroQuartoForm.reset();
        } else {
          alert(data.message || 'Erro ao cadastrar quarto');
        }
      } catch (error) {
        alert('Erro ao conectar ao servidor');
      }
    });
  }

  // Modal de novo tipo de quarto
  const novoTipoBtn = document.getElementById('novoTipoBtn');
  const modalNovoTipo = document.getElementById('modalNovoTipo');
  const salvarNovoTipo = document.getElementById('salvarNovoTipo');
  const cancelarNovoTipo = document.getElementById('cancelarNovoTipo');

  if (novoTipoBtn && modalNovoTipo && salvarNovoTipo && cancelarNovoTipo) {
    novoTipoBtn.onclick = () => { modalNovoTipo.style.display = 'flex'; };
    cancelarNovoTipo.onclick = () => { modalNovoTipo.style.display = 'none'; };
    salvarNovoTipo.onclick = async () => {
      const tipo = document.getElementById('novoTipoTipo').value;
      const descricao = document.getElementById('novoTipoDescricao').value;
      const valor_diaria = document.getElementById('novoTipoValor').value;
      if (!tipo || !descricao || !valor_diaria) {
        alert('Preencha todos os campos!');
        return;
      }
      const resp = await fetch('http://localhost:3000/api/tipos-quarto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, descricao, valor_diaria })
      });
      if (resp.ok) {
        alert('Tipo de quarto cadastrado!');
        modalNovoTipo.style.display = 'none';
        document.getElementById('novoTipoTipo').value = '';
        document.getElementById('novoTipoDescricao').value = '';
        document.getElementById('novoTipoValor').value = '';
        carregarTiposQuarto();
      } else {
        alert('Erro ao cadastrar tipo de quarto');
      }
    };
    // Fechar modal ao clicar fora do conteúdo
    modalNovoTipo.onclick = (e) => {
      if (e.target === modalNovoTipo) modalNovoTipo.style.display = 'none';
    };
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

  // Listar clientes na tabela de clientes.html
  async function carregarClientes() {
    const tbody = document.getElementById('clientes-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';
    try {
      const resp = await fetch('/api/clientes');
      const clientes = await resp.json();
      if (!clientes.length) {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum cliente cadastrado</td></tr>';
        return;
      }
      tbody.innerHTML = '';
      clientes.forEach(cliente => {
        tbody.innerHTML += `
          <tr>
            <td>${cliente.cpf}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.cep}</td>
            <td>${cliente.endereco}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.email}</td>
            <td>${cliente.data_cadastro ? cliente.data_cadastro : ''}</td>
          </tr>
        `;
      });
    } catch (error) {
      tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar clientes</td></tr>';
    }
  }

  carregarCheckins();
  carregarCheckouts();
  carregarClientes();

  async function preencherFormularioEdicaoCliente() {
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');
    if (clienteId) {
      try {
        const resp = await fetch(`/api/clientes/${clienteId}`);
        const cliente = await resp.json();
        if (cliente) {
          document.getElementById('nome').value = cliente.nome || '';
          document.getElementById('cpf').value = cliente.cpf || '';
          document.getElementById('telefonecliente').value = cliente.telefone || '';
          document.getElementById('emailcliente').value = cliente.email || '';
          document.getElementById('endereco').value = cliente.endereco || '';
          document.getElementById('cep').value = cliente.cep || '';
        }
      } catch (error) {
        alert('Erro ao carregar dados do cliente');
      }
    }
  }

  preencherFormularioEdicaoCliente();
});