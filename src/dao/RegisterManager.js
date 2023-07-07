const bcrypt = require('bcrypt');
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
  
      // Cifrar la contraseña utilizando Bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Crear un nuevo usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      return res.redirect('/login');
    } catch (error) {
      console.error('Error processing registration:', error);
      res.redirect('/register');
    }
  },
};

module.exports = RegisterManager;
