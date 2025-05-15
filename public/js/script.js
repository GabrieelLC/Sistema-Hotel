function cadastrarCliente() {
  const cpf = document.getElementById("cpf").value;
  const nome = document.getElementById("nome").value;
  const dataNascimento = document.getElementById("dataNascimento").value;
  const cep = document.getElementById("cep").value;
  const endereco = document.getElementById("endereco").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const quarto = document.getElementById("quarto").value;

  const cliente = {
    CPF: cpf,
    Nome: nome,
    data_nasc: dataNascimento,
    CEP: cep,
    Endereco: endereco,
    Email: email,
    Telefone: telefone,
    quarto: quarto,
  };

  fetch("http://localhost:3000/api/clientes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Erro ao cadastrar cliente.");
      }
    })
    .then((data) => {
      alert(data.mensagem || "Cliente cadastrado com sucesso!");
      limparFormulario();
    })
    .catch((error) => {
      console.error(error);
      alert("Erro ao cadastrar cliente. Verifique os dados e tente novamente.");
    });
}

function limparFormulario() {
  document.getElementById("cpf").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("dataNascimento").value = "";
  document.getElementById("cep").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("email").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("quarto").value = "";
}

function filtrar() {
  const filtro = document.getElementById("filtro").value.trim().toLowerCase();

  fetch("http://localhost:3000/api/clientes")
    .then(response => response.json())
    .then(clientes => {
      const tabela = document.getElementById("tabelaClientes").getElementsByTagName('tbody')[0];
      tabela.innerHTML = ""; // Limpa a tabela

      clientes
        .filter(cliente =>
          cliente.Nome.toLowerCase().includes(filtro) ||
          cliente.CPF.toLowerCase().includes(filtro)
        )
        .forEach(cliente => {
          const linha = tabela.insertRow();
          linha.insertCell().innerText = cliente.Nome;
          linha.insertCell().innerText = cliente.CPF;
          linha.insertCell().innerText = cliente.data_nasc;
          linha.insertCell().innerText = cliente.CEP;
          linha.insertCell().innerText = cliente.Endereco;
          linha.insertCell().innerText = cliente.Email;
          linha.insertCell().innerText = cliente.Telefone;
          linha.insertCell().innerText = cliente.quarto;
        });
    });
}

function limpar() {
  document.getElementById("filtro").value = "";
  filtrar(); 
}

let listaConsumo = [];

function carregarCardapio() {
  fetch("http://localhost:3000/api/cardapio")
    .then(res => res.json())
    .then(cardapio => {
      const datalist = document.getElementById("listaCardapio");
      datalist.innerHTML = "";
      cardapio.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.nome;
        datalist.appendChild(option);
      });
    });
}

function adicionarProdutoFrigobar() {
  const produto = document.getElementById("produto").value;
  const quantidade = parseInt(document.getElementById("quantidade").value, 10);

  fetch(`http://localhost:3000/api/cardapio`)
    .then(res => res.json())
    .then(cardapio => {
      const item = cardapio.find(p => p.nome === produto);
      if (!item) {
        alert("Produto não encontrado no cardápio!");
        return;
      }
      listaConsumo.push({ produto, quantidade, preco: item.preco });
      atualizarTabelaConsumo();
    });
}

function atualizarTabelaConsumo() {
  const tabela = document.getElementById("tabelaConsumo").getElementsByTagName('tbody')[0];
  tabela.innerHTML = "";
  let total = 0;
  listaConsumo.forEach(item => {
    const linha = tabela.insertRow();
    linha.insertCell().innerText = item.produto;
    linha.insertCell().innerText = item.quantidade;
    linha.insertCell().innerText = item.preco.toFixed(2);
    linha.insertCell().innerText = (item.quantidade * item.preco).toFixed(2);
    total += item.quantidade * item.preco;
  });
  document.getElementById("totalConsumo").innerText = "Total: R$ " + total.toFixed(2);
}

// Carregar cardápio ao abrir a página
window.onload = function() {
  carregarCardapio();
  filtrar(); // Se quiser carregar clientes também
};