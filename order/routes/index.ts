import express from "express";
import orderController from "../controllers";

const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);

export default router;
