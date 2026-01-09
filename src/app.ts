import express from "express";
import morgan from "morgan";
import prisma from "./config/prisma";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/product.routes";
import cors from "cors";
import path from "path";

import orderRoutes from "./modules/orders/order.routes";

const app = express();
app.use(morgan("combined"));
app.use(cors({ origin: "http://localhost:5173" }));

// Middlewares
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "API is running " });
});

app.get("/db-test", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

// Serve static files from src/assets
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));


export default app;