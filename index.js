class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
  
    // Método para generar un nuevo ID de producto
    generateProductId() {
      return this.productIdCounter++;
    }
  
    // Método para obtener todos los productos
    getProducts() {
      return this.products;
    }
  
    // Método para agregar un nuevo producto
    addProduct(title, description, price, thumbnail, code, stock) {
        
      const existingProduct = this.products.find((product) => product.code === code);
      if (existingProduct) {
        throw new Error('El código de producto ya está en uso');
      }
  
      // Generar un nuevo ID de producto y crear un nuevo objeto de producto
      const productId = this.generateProductId();
      const newProduct = {
        id: productId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
  
      // Agregar el nuevo producto al arreglo de productos
      this.products.push(newProduct);
  
      // Devolver el nuevo producto
      return newProduct;
    }
  
    // Método para obtener un producto por su ID
    getProductById(id) {
      const product = this.products.find((product) => product.id === id);
  
      if (!product) {
        throw new Error('Producto no encontrado');
      }
  
      return product;
    }
  }
  
  // Crear una constante de ProductManager
  const productManager = new ProductManager();
  
  // Obtención de los productos (array vacio)
  console.log(productManager.getProducts());
  
  // Const para gregar un nuevo producto
  const newProduct = productManager.addProduct(
    'producto prueba',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc123',
    25
  );
  

  console.log(productManager.getProducts());
  
  try {
    productManager.addProduct(
      'producto repetido',
      'Este es un producto repetido',
      300,
      'Otra imagen',
      'abc123',
      10
    );
  } catch (error) {
    console.log(error.message);
  }
  
  console.log(productManager.getProductById(1));
  

  try {
    productManager.getProductById(2);
  } catch (error) {
    console.log(error.message);
  }
  