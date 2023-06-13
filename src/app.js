const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const productRoutes = require('./dao/productRoutes');
const Product = require('./dao/models/Product');
const Cart = require('./dao/models/Cart');
const Message = require('./dao/models/Message');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 8080;

app.use(express.json());

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

io.on('connection', (socket) => {
  console.log('A user connected');
});

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

app.use('/api/products', productRoutes);

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
  Product.findByIdAndDelete(productId)
    .then((deletedProduct) => {
      if (deletedProduct) {
        io.emit('deletedProduct', deletedProduct);
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

// Rutas para el manejo de carritos
const cartsRouter = express.Router();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get('/realtimeproducts', (req, res) => {
  Product.find()
    .then((products) => {
      res.render('realTimeProducts', { products });
    })
    .catch((error) => {
      console.error('Error retrieving products:', error);
      res.status(500).json({ error: 'Failed to retrieve products' });
    });
});

app.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  Product.findByIdAndDelete(productId)
    .then((deletedProduct) => {
      if (deletedProduct) {
        io.emit('deletedProduct', deletedProduct);
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
