// src/products/product.service.ts
import prisma from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";

export const createProduct = async (
  data: Prisma.ProductUncheckedCreateInput
) => {
  return prisma.product.create({ data });
};

export const getAllProducts = async () => {
  return prisma.product.findMany();
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({ where: { id } });
};

export const updateProduct = async (
  id: string,
  data: Prisma.ProductUncheckedUpdateInput
) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({ where: { id } });
};
