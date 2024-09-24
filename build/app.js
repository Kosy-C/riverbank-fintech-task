"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const DB_config_1 = require("./DB.config");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
require('dotenv').config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
//this calls the database connection
(0, DB_config_1.connectDB)();
app.use("/user", userRoute_1.default);
app.use("/", rateLimiter_1.apiLimit, transactionRoutes_1.default);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
exports.default = app;
