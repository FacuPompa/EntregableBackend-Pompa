const { Cart } = require('./models/Cart');

class CartManager {
  constructor() {
    this.carts = [];
    this.cartIdCounter = 0;
    this.initialize();
  }

  // Método para inicializar el administrador de carritos
  async initialize() {
    try {
      await this.loadCarts();
      this.cartIdCounter = this.getHighestCartId() + 1;
    } catch (err) {
      console.log(`Error initializing cart manager: ${err}`);
    }
  }

  // Método para cargar los carritos desde la base de datos
  async loadCarts() {
    try {
      this.carts = await Cart.find();
    } catch (err) {
      console.log(`Error loading carts from database: ${err}`);
      this.carts = [];
    }
  }

  // Método para guardar los carritos en la base de datos
  async saveCarts() {
    try {
      for (const cart of this.carts) {
        await cart.save();
      }
    } catch (err) {
      console.log(`Error saving carts to database: ${err}`);
    }
  }

  // Método para obtener el carrito con el ID más alto
  getHighestCartId() {
    let highestId = 0;
    for (const cart of this.carts) {
      if (cart.id > highestId) {
        highestId = cart.id;
      }
    }
    return highestId;
  }

  async addCart(cartData) {
    try {
      const newCart = new Cart(cartData);
      await newCart.save();
      this.carts.push(newCart);
      return newCart;
    } catch (err) {
      console.log(`Error adding cart: ${err}`);
      return null;
    }
  }

  // Obtener un carrito por su ID
  getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  // Agregar un producto a un carrito
  addProductToCart(cartId, productData) {
    const cart = this.getCartById(cartId);
    if (cart) {
      cart.products.push(productData);
      return cart;
    }
    return null;
  }

}

module.exports = CartManager;
