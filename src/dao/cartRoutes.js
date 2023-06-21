const express = require('express');
const CartManager = require('../dao/CartManager');
const { Cart } = require('../dao/models/Cart');
const mongoose = require('mongoose');

const cartsRouter = express.Router();
const cartManager = new CartManager(mongoose.connection);

// Obtener un carrito por ID
cartsRouter.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Eliminar un producto del carrito
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const success = await cartManager.removeProductFromCart(cid, pid);

    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Cart or product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
});

// Actualizar el carrito con un arreglo de productos
cartsRouter.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;

    const updatedCart = await cartManager.updateCart(cid, products);

    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Actualizar la cantidad de ejemplares de un producto en el carrito
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: 'Cart or product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product quantity in cart' });
  }
});

// Eliminar todos los productos del carrito
cartsRouter.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const success = await cartManager.clearCart(cid);

    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = cartsRouter;
