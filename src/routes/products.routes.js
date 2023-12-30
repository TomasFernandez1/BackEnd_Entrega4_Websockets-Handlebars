import {Router} from 'express'

import {ProductManager} from '../../database/ProductManager.js'

const router = Router()

const pManager = new ProductManager()

// Endpoint get all products
router.get("/products", async (req, res) => {
    try {
      // Get the limit by query if exists
      const limit = parseInt(req.query.limit, 10);
  
      // Get all products
      const products = await pManager.getProducts();

      if (products.length === 0) {
        throw new Error("There aren't any products");
      }
      // Check if there is a limit
      if (!limit) {
        return res.status(200).send(products);
      }
  
      // If there is a limit, slice the array and send
      return res.status(200).send(products.slice(0, limit));
    } catch (error) {
      return res.status(500).send({ "message": error.message });
    }
  });
  
// Endpoint to get a product by ID
router.get("/products/:pid", async (req, res) => {
    try {
      const pid = parseInt(req.params.pid); // Product ID
      const product = await pManager.getProductById(pid);
      return res.send(product);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  });

// Endpoint to create a new Product
router.post("/products", async (req, res) => {
    try {
        const newProduct = req.body // New Product
        await pManager.addProduct(newProduct)
        return res.send(newProduct);
    } catch (error) {
        return res.status(500).send({ message: error.message})
    }

})

// Endpoint to update a Product
router.put("/products/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid); // Product ID
    const updateProduct = req.body // Updated product
    await pManager.updateProduct(pid, updateProduct)
    res.send({ message: `The Product with id ${pid} was successfully updated`})

})
// Endpoint to delete a Product
router.delete("/products/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid); // Product ID
        await pManager.deleteProduct(pid)
        res.status(200).send({"message" : "Product deleted successfully"})
    } catch (error) {
        res.status(404).send({"message" : error.message})
    }

})
export default router