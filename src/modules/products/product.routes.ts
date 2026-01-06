import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "./product.controller";
import { protect } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:id", getOne);

// Admin only
router.post("/", protect, isAdmin, create);
router.put("/:id", protect, isAdmin, update);
router.delete("/:id", protect, isAdmin, remove);

export default router;
