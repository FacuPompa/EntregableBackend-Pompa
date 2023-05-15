const express = require('express');
const ProductManager = require('./ProductManager');
const fs = require('fs');
const app = express();

// Configuración del puerto
const port = 8080;

// Middleware para el manejo de datos en formato JSON
app.use(express.json());

// Crear una instancia de ProductManager
const productManager = new ProductManager('./productos.json');

// Rutas para el manejo de productos

// Listar todos los productos
app.get('/api/products', (req, res) => {
  const products = productManager.getProducts();
  const limit = req.query.limit;
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
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