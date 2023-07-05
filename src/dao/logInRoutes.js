const express = require('express');
const router = express.Router();
const LogIn = require('./LogIn');

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', LogIn.showLogin);

// Ruta para procesar el inicio de sesión
router.post('/login', LogIn.processLogin);

module.exports = router;
