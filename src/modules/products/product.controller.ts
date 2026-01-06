import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.service";

export const create = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const products = await getAllProducts();
  res.json(products);
};

export const getOne = async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
};

export const update = async (req: Request, res: Response) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.json(product);
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await deleteProduct(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
};
