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
exports.UserLogin = exports.verifyUser = exports.RegisterUser = void 0;
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const notification_1 = require("../utils/notification");
const DB_config_1 = require("../DB.config");
/**===================================== REGISTER USER ===================================== **/
const RegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('HOWFARRR');
        const { email, password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utility_1.UserRegisterSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Check if the user already exists
        const existingUser = yield userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (existingUser) {
            return res.status(400).json({
                error: "User with the given email already exists",
            });
        }
        ;
        //Generate salt
        const salt = yield (0, utility_1.GenerateSalt)();
        const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
        //Generate OTP
        const { otp, expiry } = (0, notification_1.GenerateOTP)();
        //Create User
        if (!existingUser) {
            const newUser = yield userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: userPassword,
                salt,
                otp,
                otp_expiry: expiry,
                verified: false,
            });
            //send Email to user
            const html = (0, notification_1.emailHtml)(otp);
            yield (0, notification_1.mailSent)(DB_config_1.FromAdminMail, email, DB_config_1.userSubject, html);
            //Generate a signature for user
            let signature = yield (0, utility_1.GenerateSignature)({
                id: newUser.id,
                email: newUser.email,
                verified: newUser.verified,
            });
            return res.status(201).json({
                id: newUser.id,
                message: "User created successfully. Check your email for OTP verification",
                signature,
                verified: newUser.verified,
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/user/signup",
        });
    }
});
exports.RegisterUser = RegisterUser;
/**===================================== VERIFY USER ===================================== **/
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find the user by ID
        const user = yield userModel_1.UserInstance.findOne({
            where: { id: id },
        });
        if (!user) {
            return res.status(404).json({
                error: "User with ID not found",
            });
        }
        // Check if the user is already verified
        if (user.verified === true) {
            return res.status(400).json({
                error: "User is already verified",
            });
        }
        // Update the user as verified
        yield userModel_1.UserInstance.update({ verified: true }, { where: { id: id } });
        return res.status(200).json({
            message: "Email verification successful"
        });
    }
    catch (err) {
        res.status(500).json({
            error: "Internal server error",
            route: "/user/verify/:id",
        });
    }
});
exports.verifyUser = verifyUser;
/**===================================== LOGIN USER ===================================== **/
const UserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.UserLoginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the User exist
        const User = yield userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (User) {
            //Validate password
            const isValidPassword = yield (0, utility_1.validatePassword)(password, User.password, User.salt);
            if (isValidPassword) {
                //Generate signature for user
                let signature = yield (0, utility_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                // Example: Set a cookie with the token
                res.cookie("token", signature);
                return res.status(200).json({
                    message: "Login Successful",
                    signature,
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
            }
            else {
                res.status(400).json({
                    Error: "Wrong email or password",
                });
            }
        }
        return res.status(404).json({
            Error: `User with ${email} not found`,
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error", err,
            route: "/user/login",
        });
    }
});
exports.UserLogin = UserLogin;
