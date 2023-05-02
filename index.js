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
    const products = this.getProducts();
    let highestId = 0;
    for (const product of products) {
      if (product.id > highestId) {
        highestId = product.id;
      }
    }
    return highestId;
  }

  // Método para agregar un nuevo producto
  addProduct(product) {
    const existingProduct = this.products.find((p) => p.code === product.code);
    if (existingProduct) {
      throw new Error('The product code is already in use');
    }

    // Generar un nuevo ID de producto y crear un nuevo objeto de producto
    const productId = this.productIdCounter++;
    const newProduct = {
      id: productId,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,
    };

    // Agregar el nuevo producto al arreglo de productos
    this.products.push(newProduct);
    this.saveProducts();

    // Devolver el nuevo producto
    return newProduct;
  }

  // Método para obtener todos los productos
  getProducts() {
    return this.products;
  }

  // Método para obtener un producto por su ID
  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  // Método para actualizar un producto
  updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const productToUpdate = this.products[productIndex];

    // Actualizar solo los campos que se hayan enviado
    if (updatedProduct.title !== undefined) {
      productToUpdate.title = updatedProduct.title;
    }

    if (updatedProduct.description !== undefined) {
      productToUpdate.description = updatedProduct.description;
    }

    if (updatedProduct.price !== undefined) {
      productToUpdate.price = updatedProduct.price;
    }

    if (updatedProduct.thumbnail !== undefined) {
      productToUpdate.thumbnail = updatedProduct.thumbnail;
    }

    if (updatedProduct.code !== undefined) {
      productToUpdate.code = updatedProduct.code;
    }

    if (updatedProduct.stock !== undefined) {
      productToUpdate.stock = updatedProduct.stock;
    }

    this.saveProducts();

    return productToUpdate;
  }

  // Método para eliminar un producto
  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    this.products.splice
  }}