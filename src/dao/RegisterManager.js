const User = require('./models/User');

const RegisterManager = {
  showRegister(req, res) {
    res.render('register');
  },

  async processRegister(req, res) {
    const { name, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('register', { error: 'El correo electrónico ya está registrado' });
      }
  
      // Crear un nuevo usuario
      const newUser = new User({
        name,
        email,
        password,
      });
  
      await newUser.save();
  
      return res.redirect('/login'); // Redireccionar al formulario de inicio de sesión
    } catch (error) {
      console.error('Error processing registration:', error);
      res.redirect('/register');
    }
  },
};

module.exports = RegisterManager;
