"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.createTransaction = void 0;
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const transactionModel_1 = require("../model/transactionModel");
/**===================================== CREATE TRANSACTION ===================================== **/
const createTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, recipient_account_number, sender_account_number, description, userId, } = req.body;
        const uuidTransaction = (0, uuid_1.v4)();
        const validateResult = utility_1.TransactionSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        ;
        //check if the transaction exists
        const transaction = yield transactionModel_1.TransactionInstance.findOne({
            where: { transaction_id: uuidTransaction },
        });
        if (!transaction) {
            yield transactionModel_1.TransactionInstance.create({
                transaction_id: uuidTransaction,
                amount,
                recipient_account_number,
                sender_account_number,
                description,
                userId: req.user.id
            });
            //Re-check if the transaction exist
            const transaction = yield transactionModel_1.TransactionInstance.findOne({
                where: { transaction_id: uuidTransaction, },
            });
            return res.status(201).json({
                message: "Transaction created successfully",
                transaction
            });
        }
        ;
        return res.status(400).json({
            Error: "Transaction already exists!",
        });
    }
    catch (err) {
        res.status(400).json({
            Error: "Error creatin transactions", err,
            route: "/create-transaction"
        });
    }
});
exports.createTransaction = createTransaction;
/**===================================== VIEW/GET ALL TRANSACTION ===================================== **/
const getTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const transactions = yield transactionModel_1.TransactionInstance.findAndCountAll({
            where: { userId: req.user.id },
            limit: Number(limit),
            offset,
            order: [['createdAt', 'DESC']],
        });
        return res.status(200).json({
            message: "Transactions retrieved successfully",
            transactions
        });
    }
    catch (err) {
        res.status(400).json({
            Error: "Error getting transactions", err,
            route: "/get-transactions"
        });
    }
});
exports.getTransactions = getTransactions;
