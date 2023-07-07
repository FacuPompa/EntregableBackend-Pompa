const crypto = require('crypto');
const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Usuario no registrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const LogIn = {
  showLogin(req, res) {
    res.render('login');
  },

  processLogin(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/success',
      failureRedirect: '/login',
    })(req, res, next);
  },

  processRegister(req, res, next) {
    const { name, email, password } = req.body;

    User.findOne({ email })
      .then((existingUser) => {
        if (existingUser) {
          return res.render('register', { error: 'El usuario ya está registrado' });
        }

        bcrypt
          .hash(password, 10)
          .then((hashedPassword) => {
            const newUser = new User({
              name,
              email,
              password: hashedPassword,
            });

            newUser
              .save()
              .then(() => {
                res.render('login', { message: 'Usuario registrado correctamente' });
              })
              .catch((error) => {
                console.error('Error saving user:', error);
                res.redirect('/register');
              });
          })
          .catch((error) => {
            console.error('Error hashing password:', error);
            res.redirect('/register');
          });
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.redirect('/register');
      });
  },

  logout(req, res) {
    req.logout();
    res.redirect('/login');
  },
};

module.exports = LogIn;
