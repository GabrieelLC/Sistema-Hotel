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
