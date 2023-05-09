const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.loadProducts();
    this.productIdCounter = this.getHighestProductId() + 1;
  }

// Método para cargar los productos desde el archivo  // Método para cargar los productos desde el archivo

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


  // Método para agregar un nuevo producto

  addProduct(product) {
    const existingProduct = this.products.find((p) => p.code === product.code);
    if (existingProduct) {
      throw new Error('The product code is already in use');
    }

// Generar un nuevo ID de producto y crear un nuevo objeto de producto

    const newProduct = {
      id: this.productIdCounter++,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,
    };

// Agregar el nuevo producto al array 

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

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedProduct
    };

    this.saveProducts();

    return this.products[productIndex];
  }

//Método para eliminar producto

  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

// Eliminar el producto del array con splice

    this.products.splice(productIndex, 1);
    this.saveProducts();
  }
}

module.exports = ProductManager;
