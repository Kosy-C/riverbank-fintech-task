import { request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { option, TransactionSchema } from "../utils/utility";
import { TransactionAttributes, TransactionInstance } from "../model/transactionModel";

/**===================================== CREATE TRANSACTION ===================================== **/
export const createTransaction = async (req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const {
            amount,
            recipient_account_number,
            sender_account_number,
            description,
            userId,
        } = req.body;
        const uuidTransaction = uuidv4();

        const validateResult = TransactionSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        };

        //check if the transaction exists
        const transaction = await TransactionInstance.findOne({
            where: { transaction_id: uuidTransaction },
        }) as unknown as TransactionAttributes;

        if (!transaction) {
            await TransactionInstance.create({
                transaction_id: uuidTransaction,
                amount,
                recipient_account_number,
                sender_account_number,
                description,
                userId: req.user.id
            });

            //Re-check if the transaction exist
            const transaction = await TransactionInstance.findOne({
                where: { transaction_id: uuidTransaction, },
            }) as unknown as TransactionAttributes;

            return res.status(201).json({
                message: "Transaction created successfully",
                transaction
            });
        };

        return res.status(400).json({
            Error: "Transaction already exists!",
        });
    } catch (err) {
        res.status(400).json({
            Error: "Error creatin transactions", err,
            route: "/create-transaction"
        });
    }
};

/**===================================== VIEW/GET ALL TRANSACTION ===================================== **/
export const getTransactions = async (req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const { page, limit } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const transactions = await TransactionInstance.findAndCountAll({
            where: { userId: req.user.id },
            limit: Number(limit),
            offset,
            order: [['createdAt', 'DESC']],
        }) as unknown as TransactionAttributes[];

        return res.status(200).json({
            message: "Transactions retrieved successfully",
            transactions
        });
    } catch (err) {
        res.status(400).json({
            Error: "Error getting transactions", err,
            route: "/get-transactions"
        });
    }
};