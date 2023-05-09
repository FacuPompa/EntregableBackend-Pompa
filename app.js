const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();

const productManager = new ProductManager('./productos.json');

app.get('/products', (req, res) => {
  const products = productManager.getProducts();
  const limit = req.query.limit;
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  res.json(product);
});

const newProduct = {
  title: 'producto nuevo',
  description: 'descripción del nuevo producto',
  price: 2500,
  thumbnail: 'imagendelobjeto.jpg',
  code: 'NP1',
  stock: 10,
};

const addedProduct = productManager.addProduct(newProduct);
console.log('Producto agregado:', addedProduct);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
