const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apiRoutes = require('./routes/api');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', apiRoutes);

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});