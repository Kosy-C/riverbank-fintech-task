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
exports.userSubject = exports.FromAdminMail = exports.APP_SECRET = exports.connectDB = exports.db = void 0;
const sequelize_1 = require("sequelize");
require("dotenv").config();
exports.db = new sequelize_1.Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    logging: false
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.db.authenticate();
        yield exports.db.sync();
        console.log("Connection established successfully");
    }
    catch (error) {
        console.log("Unable to connect to database:", error);
    }
});
exports.connectDB = connectDB;
exports.APP_SECRET = process.env.APP_SECRET;
// export const GMAIL_USER = process.env.GMAIL_USER;
// export const GMAIL_PASS = process.env.GMAIL_PASS;
exports.FromAdminMail = process.env.FromAdminMail;
exports.userSubject = process.env.usersubject;
