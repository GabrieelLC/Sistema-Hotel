const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// Rota para cadastrar hóspede
router.post('/hospedes', hotelController.cadastrarHospede);

module.exports = router;
