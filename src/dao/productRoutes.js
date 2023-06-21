const express = require('express');
const ProductManager = require('../dao/ProductManager');
const { Product } = require('../dao/models/Product');
const mongoose = require('mongoose');


const productsRouter = express.Router();
const productManager = new ProductManager(mongoose.connection);


// Obtener todos los productos
productsRouter.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Crear un objeto de filtros basado en los parámetros recibidos
    const filters = {};
    if (query) {
      filters.category = query; // Filtrar por categoría
    }

    // Obtener el total de productos según los filtros
    const totalProducts = await productManager.countProducts(filters);

    // Calcular la cantidad total de páginas y la página actual
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = parseInt(page);

    // Calcular el índice de inicio y fin de los productos según la página actual
    const startIndex = (currentPage - 1) * limit;
    const endIndex = currentPage * limit;

    // Obtener los productos según los filtros y opciones de ordenamiento
    let products = await productManager.getProducts(filters, sort);

    // Aplicar la paginación a los productos
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Construir el objeto de respuesta
    const response = {
      status: 'success',
      payload: paginatedProducts,
      totalPages: totalPages,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      prevLink: currentPage > 1 ? `/products?limit=${limit}&page=${currentPage - 1}&sort=${sort}&query=${query}` : null,
      nextLink: currentPage < totalPages ? `/products?limit=${limit}&page=${currentPage + 1}&sort=${sort}&query=${query}` : null
    };

    res.json(response);
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
