import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connection from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminCustomerRoutes from "./routes/adminCustomerRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { seedAdmin } from "./seed_admin.js";
import { seedSampleProducts } from "./seed_sample_products.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use("/sample-products", express.static("public/sample-products"));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "Wearthly API",
    status: "online",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

// Must allow the exact frontend origin with credentials: true so the
// browser will store and send the JWT cookie on cross-origin requests.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

connection();
// connection() returns void, so we use the mongoose "open" event.
mongoose.connection.once("open", () => {
  seedAdmin()
    .then((admin) => seedSampleProducts(admin?._id))
    .catch((error) => {
      console.error("Startup seed failed:", error);
    });
});

app.use("/api/v1", authRoutes);
app.use("/api/v1/profile", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", adminCustomerRoutes);
app.use("/api/v1", inventoryRoutes);
app.use("/api/v1", supplierRoutes);
app.use("/api/v1", settingsRoutes);

// Central error handler so multer/other middleware errors return a
// readable JSON response instead of Express's default HTML 500.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.http_code || err.status || 500).json({
    message: err.message || "Internal service error",
    success: false,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Working on PORT: ", process.env.PORT);
});