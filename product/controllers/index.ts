import { Request, Response } from "express";
import Product from "../models";

const addProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const product = new Product({
      ...data,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding the product" });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    // Find the product by ID and remove it
    const product = await Product.findByIdAndRemove(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting the product" });
  }
};

const productController = {
  getAllProducts,
  addProduct,
  deleteProduct,
};

export default productController;
