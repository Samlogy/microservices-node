import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, product, quantity } = req.body;

    const order = await prisma.order.create({
      data: {
        customerId,
        product,
        quantity,
      },
    });

    res.status(201).json({ success: false, data: order });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error creating the order" });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany();
    res.status(200).json({ success: false, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

const orderController = {
  createOrder,
  getAllOrders,
};

export default orderController;
