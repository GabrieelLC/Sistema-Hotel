function cadastrarCliente() {
  const cpf = document.getElementById("cpf").value;
  const nome = document.getElementById("nome").value;
  const dataNascimento = document.getElementById("dataNascimento").value;
  const endereco = document.getElementById("endereco").value;
  const cep = document.getElementById("cep").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const quarto = document.getElementById("quarto").value;

  const cliente = {
    cpf: cpf,
    nome: nome,
    dataNascimento: dataNascimento,
    endereco: endereco,
    cep: cep,
    email: email,
    telefone: telefone,
    quarto: quarto,
  };

  // Enviar os dados para o backend
  fetch('/api/hospedes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erro ao cadastrar cliente.');
      }
    })
    .then((data) => {
      alert(data.mensagem || 'Cliente cadastrado com sucesso!');
      limparFormulario(); // Limpa o formulário após o cadastro
    })
    .catch((error) => {
      console.error(error);
      alert('Erro ao cadastrar cliente. Verifique os dados e tente novamente.');
    });
}

function limparFormulario() {
  document.getElementById("cpf").value = '';
  document.getElementById("nome").value = '';
  document.getElementById("dataNascimento").value = '';
  document.getElementById("endereco").value = '';
  document.getElementById("cep").value = '';
  document.getElementById("email").value = '';
  document.getElementById("telefone").value = '';
  document.getElementById("quarto").value = '';
}
