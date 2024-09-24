import express from "express";
import { createTransaction, getTransactions } from "../controller/transactionController";
import { userAuth } from "../middleware/authorization";


const router = express.Router();

router.post("/create-transaction", userAuth, createTransaction);
router.get("/get-transactions", userAuth, getTransactions);


export default router;