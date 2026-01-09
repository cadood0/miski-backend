import prisma from "../../config/prisma";
import { OrderStatus,StockStatus  } from "../../generated/prisma/client";

export const createOrder = async (userId: string, items: { productId: string, quantity: number }[]) => {
  if (items.length === 0) throw new Error("Cart is empty");

  let totalAmount = 0;

  const orderItemsData = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || !product.isActive) throw new Error(`Product ${item.productId} not available`);
    if (product.stock === "outOfStock") throw new Error(`Not enough stock for ${product.name}`);

    totalAmount += product.price * item.quantity;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

 // Update stock (enum logic only)
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) continue;

    let newStock: StockStatus = product.stock;

    // Simple enum “decrement logic”
    if (product.stock === "inStock" && item.quantity > 0) {
      newStock = "lowStock"; // example: assume any purchase drops it to lowStock
    } else if (product.stock === "lowStock") {
      newStock = "outOfStock"; // example: lowStock → outOfStock
    }

    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: newStock },
    });

  return order;
};
};

export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllOrders = async () => {
  return prisma.order.findMany({ include: { items: true, user: true }, orderBy: { createdAt: "desc" } });
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};
