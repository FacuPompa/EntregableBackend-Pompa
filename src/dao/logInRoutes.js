const express = require('express');
const logInRouter = express.Router();
const LogIn = require('./LogIn');

// Ruta para mostrar el formulario de inicio de sesión
logInRouter.get('/login', LogIn.showLogin);

// Ruta para procesar el inicio de sesión
logInRouter.post('/login', LogIn.processLogin);

// Ruta para mostrar el formulario de registro
logInRouter.get('/register', LogIn.showRegister);

// Ruta para procesar el registro
logInRouter.post('/register', LogIn.processRegister);

// Ruta para cerrar sesión
logInRouter.get('/logout', LogIn.logout);

module.exports = logInRouter;
