const express = require('express');
const ProductManager = require('./ProductManager');
const productRoutes = require('./productRoutes');
const fs = require('fs');
const app = express();
const exphbs = require('express-handlebars');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');



// Configuración del puerto
const port = 8080;

// Middleware para el manejo de datos en formato JSON
app.use(express.json());

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set("views", __dirname + "/views");

// Configurar Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

});


// Crear una instancia de ProductManager
const productManager = new ProductManager('./src/productos.json');

// Registrar las rutas del enrutador de productos
app.use('/api/products', productRoutes);

// Listar todos los productos
app.get('/api/products', (req, res) => {
  const products = productManager.getProducts(); 
  const limit = req.query.limit;
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.render('index', { products });
  }
});


// Obtener un producto por su ID
app.get('/api/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  res.json(product);
});

// Agregar un nuevo producto
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  const addedProduct = productManager.addProduct(newProduct);

  // Envia el nuevo producto a través del socket a la vista en tiempo real
  io.emit('newProduct', addedProduct);

  res.json(addedProduct);
});


// Actualizar un producto por su ID
app.put('/api/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;
  const product = productManager.updateProduct(productId, updatedProduct);
  res.json(product);
});

// Eliminar un producto por su ID
app.delete('/api/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  productManager.deleteProduct(productId);
  res.json({ message: 'Product deleted' });
});

// Rutas para el manejo de carritos

const cartsRouter = express.Router();

app.listen(port, () => {

  console.log(`Server is listening on port ${port}`);
  
  });

  //Ruta para renderizar realTimeProducts.handlebars
  app.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
  });
  

  //Ruta para eliminar productos utilizando websockets
  app.delete('/api/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const deletedProduct = productManager.getProductById(productId);
    const success = productManager.deleteProduct(productId);
  
    if (success) {
      // Envia el producto eliminado a través del socket a la vista en tiempo real
      io.emit('deletedProduct', deletedProduct);
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });
  