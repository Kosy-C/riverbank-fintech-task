// import { DataTypes, Model } from "sequelize";
// import { db } from "../DB.config";
// import { UserInstance } from "./userModel";

// export interface TransactionAttributes {
//     transaction_id: string,
//     amount: number,
//     recipient_account_number: string,
//     sender_account_number: string,
//     description: string,
//     userId: string
// }

// export class TransactionInstance extends Model<TransactionAttributes> {}

// TransactionInstance.init ({
//     transaction_id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//         allowNull: false
//     },
//     amount: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     recipient_account_number: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     sender_account_number: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     userId: {
//         type: DataTypes.UUID,
//         allowNull: false,
//     }
// },
// {
//     sequelize: db,
//     tableName: 'transaction'
// });

// TransactionInstance.belongsTo(UserInstance, {
//     foreignKey: 'userId',
//     as: 'user'
// });

import { DataTypes, Model } from "sequelize";
import { db } from "../DB.config";
import { UserInstance } from "./userModel";

export interface TransactionAttributes {
    transaction_id: string,
    amount: number,
    recipient_account_number: string,
    sender_account_number: string,
    description: string,
    userId: string
}

export class TransactionInstance extends Model<TransactionAttributes> {}

TransactionInstance.init ({
    transaction_id: {
        type: DataTypes.UUID, // Generates UUID
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recipient_account_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sender_account_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID, // Refers to the user's UUID
        allowNull: false,
    }
},
{
    sequelize: db,
    tableName: 'transaction'
});

// Association - A transaction belongs to one user
TransactionInstance.belongsTo(UserInstance, {
    foreignKey: 'userId',
    as: 'user' // This allows the relation to be referenced as 'user'
});
