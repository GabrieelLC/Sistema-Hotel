const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Hotel', 
});

db.connect(err => {
  if (err) throw err;
  console.log('Conexão com o banco de dados estabelecida!');
});

module.exports = db;
