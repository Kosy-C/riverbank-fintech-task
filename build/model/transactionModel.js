"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionInstance = void 0;
const sequelize_1 = require("sequelize");
const DB_config_1 = require("../DB.config");
class TransactionInstance extends sequelize_1.Model {
}
exports.TransactionInstance = TransactionInstance;
TransactionInstance.init({
    transaction_id: {
        type: sequelize_1.DataTypes.UUID, // Generates UUID
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    recipient_account_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    sender_account_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.UUID, // Refers to the user's UUID
        allowNull: false,
    }
}, {
    sequelize: DB_config_1.db,
    tableName: 'transaction'
});
