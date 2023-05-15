const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = this.loadCarts();
    this.cartIdCounter = this.getHighestCartId() + 1;
  }

  // Método para cargar los carritos desde el archivo
  loadCarts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.log(`Error loading cart file: ${err}`);
      return [];
    }
  }

  // Método para guardar los carritos en el archivo
  saveCarts() {
    const data = JSON.stringify(this.carts);
    fs.writeFileSync(this.filePath, data);
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
