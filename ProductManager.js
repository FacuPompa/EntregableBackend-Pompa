const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.loadProducts();
    this.productIdCounter = this.getHighestProductId() + 1;
  }

  // Método para cargar los productos desde el archivo
  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.log(`Error loading product file: ${err}`);
      return [];
    }
  }

  // Método para guardar los productos en el archivo
  saveProducts() {
    const data = JSON.stringify(this.products);
    fs.writeFileSync(this.filePath, data);
  }

  // Método para obtener el producto con el ID más alto
  getHighestProductId() {
    let highestId = 0;
    for (const product of this.products) {
      if (product.id > highestId) {
        highestId = product.id;
      }
    }
    return highestId;
  }

  // Resto de los métodos relacionados con los productos (addProduct, getProducts, getProductById, updateProduct, deleteProduct)
}

module.exports = ProductManager;
