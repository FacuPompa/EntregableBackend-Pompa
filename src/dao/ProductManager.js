const { v4: uuidv4 } = require('uuid');
const { Product } = require('./models/Product');

class ProductManager {
  // Constructor sin el parámetro filePath
  constructor() {
    this.initialize();
  }

  // Método para inicializar el administrador de productos
  async initialize() {
    try {
      // No es necesario cargar los productos desde un archivo
    } catch (err) {
      console.log(`Error initializing product manager: ${err}`);
    }
  }

  // Obtener todos los productos
  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  }

  // Obtener un producto por ID
  async getProductById(pid) {
    try {
      const product = await Product.findById(pid);
      return product;
    } catch (error) {
      throw new Error('Failed to fetch product');
    }
  }

  // Agregar un nuevo producto
  async addProduct(newProduct) {
    try {
      const product = new Product({
        id: uuidv4(),
        ...newProduct,
      });
      await product.save();
      return product;
    } catch (error) {
      throw new Error('Failed to add product');
    }
  }

  // Actualizar un producto
  async updateProduct(pid, updatedProduct) {
    try {
      const product = await Product.findByIdAndUpdate(pid, updatedProduct, { new: true });
      return product;
    } catch (error) {
      throw new Error('Failed to update product');
    }
  }

  // Eliminar un producto
  async deleteProduct(pid) {
    try {
      const result = await Product.findByIdAndDelete(pid);
      return result !== null;
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  }
}

module.exports = ProductManager;
