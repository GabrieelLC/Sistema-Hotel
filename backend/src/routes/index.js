const express = require('express');
const router = express.Router();


const someController = require('../controllers/index');

router.get('/some-route', someController.someFunction);
router.post('/another-route', someController.anotherFunction);

module.exports = router;