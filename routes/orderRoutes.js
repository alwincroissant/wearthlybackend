import express from "express";
import { auth, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  newCheckout,
  newOrder,
  getMyOrders,
  getOrderDetails,
  getAdminOrders,
  updateOrderStatus,
  getOrderReceipt,
  getDashboardStats,
  cancelMyOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// ── Customer routes ──────────────────────────────────────────────────────────
router.post("/checkout", auth, newCheckout);
router.post("/order/new", auth, newOrder);
router.get("/orders/me", auth, getMyOrders);
router.get("/order/:id", auth, getOrderDetails);
router.get("/order/:id/receipt", auth, getOrderReceipt);
router.put("/order/:id/cancel", auth, cancelMyOrder);

// ── Admin routes ─────────────────────────────────────────────────────────────
router.get("/admin/dashboard-stats", auth, authorizeRoles("admin"), getDashboardStats);
router.get("/admin/orders", auth, authorizeRoles("admin"), getAdminOrders);
router.put("/admin/order/:id/status", auth, authorizeRoles("admin"), updateOrderStatus);

export default router;
