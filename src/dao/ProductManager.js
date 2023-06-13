const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.initialize();
  }

  // Método para inicializar el administrador de productos
  async initialize() {
    try {
      await this.loadProducts();
    } catch (err) {
      console.log(`Error initializing product manager: ${err}`);
    }
  }

  // Método para cargar los productos desde el archivo
  async loadProducts() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      this.products = JSON.parse(data);
    } catch (err) {
      console.log(`Error loading product file: ${err}`);
      this.products = [];
    }
  }

  // Método para guardar los productos en el archivo
  async saveProducts() {
    const data = JSON.stringify(this.products);
    await fs.promises.writeFile(this.filePath, data);
  }

  // Obtener todos los productos
  getProducts() {
    return this.products;
  }

  // Obtener un producto por ID
  getProductById(pid) {
    return this.products.find((product) => product.id === pid);
  }

  // Agregar un nuevo producto
  addProduct(newProduct) {
    const product = {
      id: uuidv4(), 
      ...newProduct,
    };

    this.products.push(product);
    this.saveProducts();

    return product;
  }

  // Actualizar un producto
  updateProduct(pid, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === pid);

    if (index !== -1) {
      this.products[index] = {
        id: pid,
        ...updatedProduct,
      };
      this.saveProducts();
      return this.products[index];
    }

    return null;
  }

  // Eliminar un producto
  deleteProduct(pid) {
    const index = this.products.findIndex((product) => product.id === pid);

    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return true;
    }

    return false;
  }
}

module.exports = ProductManager;
