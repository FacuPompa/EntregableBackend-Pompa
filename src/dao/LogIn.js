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
        return res.redirect('/login');
      }

      // Verificar la contraseña utilizando SHA-256
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      if (user.password === hashedPassword) {
        // Inicio de sesión exitoso

        // Verificar el rol del usuario
        if (user.role === 'admin') {
          // Redirigir al usuario administrador a la página de administración
          return res.redirect('/admin');
        }

        // Guardar los datos de sesión en req.session
        req.session.user = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

        return res.redirect('/products');
      } else {
        return res.redirect('/login');
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
        return res.redirect('/register');
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
  
      return res.redirect('/login'); // Redireccionar al formulario de inicio de sesión
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

