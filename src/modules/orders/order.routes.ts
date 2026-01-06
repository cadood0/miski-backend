import { Router } from "express";
import { create, getMine, getAll, updateStatus } from "./order.controller";
import { protect } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";

const router = Router();

// User routes
router.post("/", protect, create);
router.get("/my", protect, getMine);

// Admin routes
router.get("/", protect, isAdmin, getAll);
router.patch("/:id/status", protect, isAdmin, updateStatus);

export default router;
