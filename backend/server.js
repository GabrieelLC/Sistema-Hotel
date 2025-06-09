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
    console.error('deu nao paezao', err);
    process.exit(1); 
  }
  console.log('conectou porra!');
});

app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`rodando nessa porta aqui ---> ${PORT}`);
});