const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
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

  // Método para cargar los carritos desde el archivo
  async loadCarts() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      this.carts = JSON.parse(data);
    } catch (err) {
      console.log(`Error loading cart file: ${err}`);
      this.carts = [];
    }
  }

  // Método para guardar los carritos en el archivo
  async saveCarts() {
    const data = JSON.stringify(this.carts);
    await fs.promises.writeFile(this.filePath, data);
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

  // Resto de los métodos relacionados con los carritos (addCart, getCartById, addProductToCart)
}

module.exports = CartManager;
