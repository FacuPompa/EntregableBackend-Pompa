const express = require('express');
const ProductManager = require('./ProductManager');

const productsRouter = express.Router();
const productManager = new ProductManager('productos.json');

// Obtener todos los productos
productsRouter.get('/', (req, res) => {
  const { limit } = req.query;
  let products = productManager.getProducts();

  if (limit) {
    products = products.slice(0, limit);
  }

  res.json(products);
});

// Obtener un producto por ID
productsRouter.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const product = productManager.getProductById(pid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = []
  } = req.body;

  const newProduct = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };

  const product = productManager.addProduct(newProduct);

  if (product) {
    res.json(product);
  } else {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Actualizar un producto
productsRouter.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;

  const product = productManager.updateProduct(pid, updatedProduct);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Eliminar un producto
productsRouter.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const success = productManager.deleteProduct(pid);

  if (success) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = productsRouter;
