// Middleware para verificar la autenticación del usuario
module.exports = {
    ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/login');
    },
  };
  