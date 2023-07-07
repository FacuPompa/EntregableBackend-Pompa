const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const logInRoutes = require('./dao/logInRoutes');
const productRoutes = require('./dao/productRoutes');
const registerRoutes = require('./dao/registerRoutes');
const LogIn = require('./dao/LogIn');
const User = require('./dao/models/User');
const Product = require('./dao/models/Product');
const Cart = require('./dao/models/Cart');
const Message = require('./dao/models/Message');
const session = require('express-session');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 8080;

// Configuración del motor de plantillas
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middleware para el análisis del cuerpo de las solicitudes
app.use(express.json());

// Configuración de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Conexión a MongoDB
mongoose
  .connect('mongodb://localhost:27017/Productos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Configuración de Passport
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

// Ruta de productos
app.use('/api/products', productRoutes);

// Rutas para login
app.use('/', logInRoutes);
app.use('/', registerRoutes);

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/products', (req, res) => {
  const limit = req.query.limit;
  if (limit) {
    Product.find()
      .limit(Number(limit))
      .then((products) => {
        res.json(products);
      })
      .catch((error) => {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Failed to retrieve products' });
      });
  } else {
    Product.find()
      .then((products) => {
        res.render('index', { products });
      })
      .catch((error) => {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Failed to retrieve products' });
      });
  }
});

app.get('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  Product.findById(productId)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    })
    .catch((error) => {
      console.error('Error retrieving product:', error);
      res.status(500).json({ error: 'Failed to retrieve product' });
    });
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  Product.create(newProduct)
    .then((addedProduct) => {
      io.emit('newProduct', addedProduct);
      res.json(addedProduct);
    })
    .catch((error) => {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    });
});

app.put('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  Product.findByIdAndUpdate(productId, updatedProduct, { new: true })
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    })
    .catch((error) => {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    });
});

app.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  Product.findByIdAndRemove(productId)
    .then((product) => {
      if (product) {
        res.json({ message: 'Product deleted' });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    })
    .catch((error) => {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    });
});

// Configuración de Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Inicialización del servidor
http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
