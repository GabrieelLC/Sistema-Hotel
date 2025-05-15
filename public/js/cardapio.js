function carregarCardapio() {
  fetch("http://localhost:3000/api/cardapio")
    .then(res => res.json())
    .then(cardapio => {
      const tbody = document.getElementById("tabelaCardapio").getElementsByTagName("tbody")[0];
      tbody.innerHTML = "";
      cardapio.forEach(produto => {
        const linha = tbody.insertRow();
        linha.insertCell().innerText = produto.nome;
        linha.insertCell().innerText = "R$ " + Number(produto.preco).toFixed(2);

        // Botões de editar e remover
        const acoes = linha.insertCell();
        acoes.innerHTML = `
          <button onclick="editarProdutoCardapio(${produto.id}, '${produto.nome}', ${produto.preco})">Editar</button>
          <button onclick="removerProdutoCardapio(${produto.id})">Remover</button>
        `;
      });
    });
}

function adicionarProdutoCardapio() {
  const nome = document.getElementById("nomeProduto").value;
  const preco = document.getElementById("precoProduto").value;

  fetch("http://localhost:3000/api/cardapio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, preco })
  })
    .then(res => res.json())
    .then(() => {
      carregarCardapio();
      document.getElementById("nomeProduto").value = "";
      document.getElementById("precoProduto").value = "";
    });
}

function removerProdutoCardapio(id) {
  fetch(`http://localhost:3000/api/cardapio/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(() => carregarCardapio());
}

function editarProdutoCardapio(id, nomeAtual, precoAtual) {
  const nome = prompt("Novo nome do produto:", nomeAtual);
  if (nome === null) return;
  const preco = prompt("Novo preço:", precoAtual);
  if (preco === null) return;

  fetch(`http://localhost:3000/api/cardapio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, preco })
  })
    .then(res => res.json())
    .then(() => carregarCardapio());
}

// Carregar cardápio ao abrir a página
window.onload = carregarCardapio;