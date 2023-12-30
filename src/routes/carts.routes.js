import { Router } from "express";
import { cartManager } from "../../database/CartManager.js";
import { ProductManager } from "../../database/ProductManager.js";

const router = Router();
const cManager = new cartManager();
const pManager = new ProductManager();


// Endpoint to create a cart
router.post("/carts", async (req, res) => {
  await cManager.newCart({ products: [] });
  res.status(200).send("Cart created");
});

// Endpoint to Get the list of products from a cart using ID
router.get("/carts/:cid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid); // Cart ID
    const cart = await cManager.getCartById(cid);
    res.status(200).send(cart.products);
  } catch (error) {
    res.status(500).send({ Message: error.message });
  }
});

// Ednpoint to add a product to the cart using ID cart and ID product
router.post("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid); // Get cart ID
    const pid = parseInt(req.params.pid); // Get product ID
 
    // Check if the product with the given ID exists
    if (await pManager.getProductById(pid)) {
      cManager.addProductToCart(cid, pid);
    }
    res.status(200).send({"Message": "Product added successfully"})
  } catch (error) {
    res.status(500).send({ "Message": error.message });
  }
});

export default router;
