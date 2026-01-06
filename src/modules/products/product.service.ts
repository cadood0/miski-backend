import prisma from "../../config/prisma";

export const createProduct = async (data: {
  name: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
}) => {
  return prisma.product.create({
    data,
  });
};

export const getAllProducts = async () => {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

export const updateProduct = async (
  id: string,
  data: Partial<{
    name: string;
    brand: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
  }>
) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  // Soft delete
  return prisma.product.delete({
    where: { id },
  });
};
