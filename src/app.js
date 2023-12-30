import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import { ProductManager } from "../database/ProductManager.js";

// Routes
import productsRoute from "./routes/products.routes.js";
import cartsRoute from "./routes/carts.routes.js";

// Create Express and ProductManager instances
const app = express();
const pManager = new ProductManager();

// Configuration of the server
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration of views
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Endpoint of the Products in real time
app.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", { pageTitle: "Product List Real Time" });
});

// Endpoint of the Products
app.get("/", async (req, res) => {
  const listadeproductos = await pManager.getProducts();
  res.render("home", { listadeproductos });
});

// Endpoints
app.use("/api", productsRoute);
app.use("/api", cartsRoute);

// Create server on port 8080
const httpServer = app.listen(8080, () => {
  console.log("Listening port 8080");
});

// Create webSocket
const io = new Server(httpServer);

// Socket connection
io.on("connection", async (socket) => {
  console.log("client connected con ID:", socket.id);
  
  // Get all the products
  const productList = await pManager.getProducts();

  // Emit an event to send all the products to the Client
  io.emit("sendProducts", productList);

  // Recieve the addProduct event from the Client
  socket.on("addProduct", async (obj) => {
    await pManager.addProduct(obj);
    const productList = await pManager.getProducts();
    io.emit("sendProducts", productList);
  });

  // Recieve the deleteProduct event from the Client
  socket.on("deleteProduct", async (id) => {
    await pManager.deleteProduct(id);
    const productList = await pManager.getProducts();
    io.emit("sendProducts", productList);
  });
});
