const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./models/User');

// Configurar la estrategia de autenticación con GitHub
passport.use(new GitHubStrategy({
  clientID: 'Iv1.934f1e43c7a7295e',
  clientSecret: '65515b2b523e53cb726669b4add234008f7f66a2',
  callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Verificar si el usuario ya existe en la base de datos
    let user = await User.findOne({ githubId: profile.id });
    
    if (user) {
      // El usuario ya está registrado, realizar el inicio de sesión
      return done(null, user);
    } else {
      // El usuario no existe, crear un nuevo usuario en la base de datos
      user = new User({
        githubId: profile.id,
        username: profile.username,
      });
  
      await user.save();
  
      return done(null, user);
    }
  } catch (error) {
    return done(error);
  }
}));

const authenticate = passport.authenticate('github');

const authenticateCallback = passport.authenticate('github', { failureRedirect: '/login' });

module.exports = {
  authenticate,
  authenticateCallback,
};
