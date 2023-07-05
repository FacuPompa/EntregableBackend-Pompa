const crypto = require('crypto');
const User = require('./models/User');

const LogIn = {
  showLogin(req, res) {
    res.render('login');
  },

  async processLogin(req, res) {
    const { email, password } = req.body;

    try {
      // Buscar el usuario por su correo electrónico
      const user = await User.findOne({ email });

      // Verificar si el usuario existe
      if (!user) {
        return res.render('login', { error: 'Usuario no registrado' });
      }

      // Verificar la contraseña utilizando SHA-256
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      if (user.password === hashedPassword) {
        // Inicio de sesión exitoso

        // Mostrar alerta de bienvenida con el nombre de usuario
        const welcomeMessage = `Bienvenido, ${user.name}!`;
        return res.render('login', { message: welcomeMessage });
      } else {
        return res.render('login', { error: 'Contraseña incorrecta' });
      }
    } catch (error) {
      console.error('Error processing login:', error);
      res.redirect('/login');
    }
  },

  async processRegister(req, res) {
    const { name, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('register', { error: 'El usuario ya está registrado' });
      }
  
      // Cifrar la contraseña utilizando SHA-256
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
      // Crear un nuevo usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      // Mostrar mensaje de éxito
      const successMessage = 'Usuario registrado correctamente';
      return res.render('login', { message: successMessage });
    } catch (error) {
      console.error('Error processing registration:', error);
      res.redirect('/register');
    }
  },
  


  logout(req, res) {
    // Cerrar sesión y redirigir al formulario de inicio de sesión
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out:', err);
      }
      res.redirect('/login');
    });
  },
};

module.exports = LogIn;
