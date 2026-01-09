// src/products/product.controller.ts
import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.service";

/**
 * CREATE PRODUCT (Admin only)
 */
export const create = async (req: Request, res: Response) => {
  try {
    const {
      name,
      brand,
      category,
      imageUrl,
      description,
      price,
      notesTop,
      notesHeart,
      notesBase,
      volume,
      stock,
      badge,
      family,
      originalPrice,
      rating,
      reviews,  
    } = req.body;

    const product = await createProduct({
      name,
      brand,
      category,
      imageUrl,
      description,
      price,
      notesTop,
      notesHeart,
      notesBase,
      volume,
      stock,
      badge,
      family,
      originalPrice,
      rating,
      reviews,  
    });

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * GET ALL PRODUCTS
 */
export const getAll = async (_req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * GET SINGLE PRODUCT
 */
export const getOne = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/**
 * UPDATE PRODUCT (Admin only)
 */
export const update = async (req: Request, res: Response) => {
  try {
    const product = await updateProduct(req.params.id, {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      price: req.body.price,
      notesTop: req.body.notesTop,
      notesHeart: req.body.notesHeart,
      notesBase: req.body.notesBase,
      volume: req.body.volume,
      stock: req.body.stock,
      badge: req.body.badge,
      family: req.body.family,
      originalPrice: req.body.originalPrice,
      rating: req.body.rating,
      reviews: req.body.reviews,
      isActive: req.body.isActive,
    });

    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

/**
 * DELETE PRODUCT (Admin only)
 */
export const remove = async (req: Request, res: Response) => {
  try {
    await deleteProduct(req.params.id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(404).json({
      message: "Product not found or delete failed",
      error: error.message,
    });
  }
};
