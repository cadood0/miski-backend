import { Router } from "express";
import { create, getAll, getOne, update, remove } from "./product.controller";
import { protect } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";

const router = Router();

// PUBLIC (shop frontend)
router.get("/", getAll);
router.get("/:id", getOne);

// ADMIN ONLY (dashboard)
router.post("/", protect, isAdmin, create);
router.put("/:id", protect, isAdmin, update);
router.delete("/:id", protect, isAdmin, remove);

export default router;
