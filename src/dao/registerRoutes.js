const express = require('express');
const registerRouter = express.Router();
const RegisterManager = require('./RegisterManager');

// Ruta para mostrar el formulario de registro
registerRouter.get('/register', RegisterManager.showRegister);

// Ruta para procesar el registro
registerRouter.post('/register', RegisterManager.processRegister);

module.exports = registerRouter;
