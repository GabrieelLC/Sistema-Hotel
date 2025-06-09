const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/routes'); 
const db = require('./config/database'); 

const app = express();

app.use(cors());
app.use(bodyParser.json());

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1); 
  }
  console.log('Conexão com o banco de dados estabelecida!');
});

// Rota para a raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo ao Sistema Hotel!');
});

// Usa as rotas configuradas no arquivo routes.js
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});