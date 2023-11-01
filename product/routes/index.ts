import express from "express";
import productController from "../controllers";

const router = express.Router();

router.post("/", productController.addProduct);
router.delete("/:productId", productController.deleteProduct);
router.get("/", productController.getAllProducts);

export default router;
