"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controller/transactionController");
const authorization_1 = require("../middleware/authorization");
const router = express_1.default.Router();
router.post("/create-transaction", authorization_1.userAuth, transactionController_1.createTransaction);
router.get("/get-transactions", authorization_1.userAuth, transactionController_1.getTransactions);
exports.default = router;
