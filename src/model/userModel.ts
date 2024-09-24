// import { DataTypes, Model } from "sequelize";
// import { db } from "../DB.config";
// import { TransactionInstance } from "./transactionModel";

// export interface UserAttributes {
//     id: string;
//     email: string;
//     password: string;
//     salt: string;
//     otp?: number;
//     otp_expiry: Date;
//     verified: boolean;
// }

// export class UserInstance extends Model<UserAttributes> {}

// UserInstance.init ({
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         validate: {
//             notNull: {msg: "Email address is required"},
//             isEmail: {msg: "Please provide a valid email"}
//         }
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             notNull: { msg: "Password is required" },
//             notEmpty: { msg: "Provide a password" },
//         }
//     },
//     salt: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//           notNull: { msg: "Salt is required" },
//           notEmpty: { msg: "Provide a salt" },
//         },
//       },
//       verified: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         validate: {
//           notNull: { msg: "User must be verified" },
//           notEmpty: { msg: "User is not verified" },
//         },
//       },
//       otp: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//           notNull: { msg: "otp is required" },
//           notEmpty: { msg: "Provide an otp" },
//         },
//       },
//       otp_expiry: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         validate: {
//           notNull: { msg: "otp expired" }
//         }
//       },
// },
// {
//     sequelize: db,
//     tableName: 'user'
// });

// UserInstance.hasMany(TransactionInstance, {
//     foreignKey: 'userId',
//     as: 'transaction' 
// });

import { DataTypes, Model } from "sequelize";
import { db } from "../DB.config";
import { TransactionInstance } from './transactionModel'; // Import transaction model

export interface UserAttributes {
    id: string;
    email: string;
    password: string;
    salt: string;
    otp?: number;
    otp_expiry: Date;
    verified: boolean;
}

export class UserInstance extends Model<UserAttributes> {}

UserInstance.init ({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Generates UUID
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {msg: "Email address is required"},
            isEmail: {msg: "Please provide a valid email"}
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Password is required" },
            notEmpty: { msg: "Provide a password" },
        }
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Salt is required" },
          notEmpty: { msg: "Provide a salt" },
        },
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "User must be verified" },
          notEmpty: { msg: "User is not verified" },
        },
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: true, // Make OTP optional
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "OTP expired" }
        }
    },
},
{
    sequelize: db,
    tableName: 'user'
});

// Association - A user has many transactions
UserInstance.hasMany(TransactionInstance, {
    foreignKey: 'userId',
    as: 'transactions' // This allows the relation to be referenced as 'transactions'
});
