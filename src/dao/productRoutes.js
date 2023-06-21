const express = require('express');
const ProductManager = require('../dao/ProductManager');
const { Product } = require('../dao/models/Product');

const productsRouter = express.Router();
const productManager = new ProductManager(); 

// Obtener todos los productos
productsRouter.get('/', async (req, res) => {
  try {
    const { limit } = req.query;

    let products = await productManager.getProducts();

    if (limit) {
      products = products.slice(0, limit);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Obtener un producto por ID
productsRouter.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
  try {
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

    const newProduct = new Product({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    });

    const product = await productManager.addProduct(newProduct);

    if (product) {
      res.json(product);
    } else {
      res.status(500).json({ error: 'Failed to add product' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Actualizar un producto
productsRouter.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = req.body;

    const product = await productManager.updateProduct(pid, updatedProduct);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Eliminar un producto
productsRouter.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const success = await productManager.deleteProduct(pid);

    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = productsRouter;
