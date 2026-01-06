import { Request, Response } from "express";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from "./order.service";

declare module "express" {
  export interface Request {
    user?: {
      userId: string;
      role?: string;
      [key: string]: any;
    };
  }
}

export const create = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userId = req.user.userId;
    const items = req.body.items;
    const order = await createOrder(userId, items);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMine = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const userId = req.user.userId;
  const orders = await getUserOrders(userId);
  res.json(orders);
};

export const getAll = async (_req: Request, res: Response) => {
  const orders = await getAllOrders();
  res.json(orders);
};

export const updateStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  try {
    const order = await updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch {
    res.status(404).json({ message: "Order not found" });
  }
};
