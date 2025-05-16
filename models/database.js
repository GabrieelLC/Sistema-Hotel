const mysql = require("mysql2");

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: "localhost", // Substitua pelo host do seu banco de dados
  user: "root", // Substitua pelo seu usuário do banco de dados
  password: "santos@santos11", // Substitua pela sua senha do banco de dados
  database: "Hotel", // Substitua pelo nome do seu banco de dados
});

// Conectando ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    return;
  }
  console.log("Conexão com o banco de dados estabelecida com sucesso!");
});

module.exports = connection;
