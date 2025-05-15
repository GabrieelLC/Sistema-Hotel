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
          linha.insertCell().innerText = ""; // Frigobar (preencha se desejar)
        });
    });
}

function limpar() {
  document.getElementById("filtro").value = "";
  filtrar(); // Mostra todos os clientes novamente
}

// Carrega todos os clientes ao abrir a página
window.onload = filtrar;