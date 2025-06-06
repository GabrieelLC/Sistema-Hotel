const express = require('express');
const router = express.Router();

// Import controllers
const someController = require('../controllers/index');

// Define routes
router.get('/some-route', someController.someFunction);
router.post('/another-route', someController.anotherFunction);

// Export the router
module.exports = router;