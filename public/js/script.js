function cadastrarCliente() {
  const cpf = document.getElementById("cpf").value;
  const nome = document.getElementById("nome").value;
  const dataNascimento = document.getElementById("dataNascimento").value;
  const endereco = document.getElementById("endereco").value;
  const cep = document.getElementById("cep").value;
  const complemento = document.getElementById("complemento").value;

  const cliente = {
    cpf: cpf,
    nome: nome,
    dataNascimento: dataNascimento,
    endereco: endereco,
    cep: cep,
    complemento: complemento,
  };

  console.log(cliente);
}
