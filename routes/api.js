const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// Exemplo de rota de teste
router.get('/teste', (req, res) => {
  res.json({ status: 'ok' });
});

// Clientes
router.post('/clientes', hotelController.cadastrarCliente);
router.get('/clientes', hotelController.listarClientes);

// Quartos
router.post('/quartos', hotelController.cadastrarQuarto);

// Frigobar
router.post('/frigobar', hotelController.registrarFrigobar);

// Check-in/Check-out
router.post('/checkin', hotelController.registrarCheckin);

module.exports = router;
