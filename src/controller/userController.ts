import { Request, Response } from "express";
import { UserAttributes, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GeneratePassword, GenerateSalt, GenerateSignature, option, UserLoginSchema, UserRegisterSchema, validatePassword } from "../utils/utility";
import { emailHtml, GenerateOTP, mailSent } from "../utils/notification";
import { FromAdminMail, userSubject } from "../DB.config";

/**===================================== REGISTER USER ===================================== **/
export const RegisterUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const uuiduser = uuidv4();

        const validateResult = UserRegisterSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }

        // Check if the user already exists
        const existingUser = await UserInstance.findOne({
            where: { email: email },
        }) as unknown as UserAttributes;

        if (existingUser) {
            return res.status(400).json({
                error: "User with the given email already exists",
            });
        };

        //Generate salt
        const salt = await GenerateSalt();

        const userPassword = await GeneratePassword(password, salt);

        //Generate OTP
        const { otp, expiry } = GenerateOTP();

        //Create User
        if (!existingUser) {
            const newUser = await UserInstance.create({
                id: uuiduser,
                email,
                password: userPassword,
                salt,
                otp,
                otp_expiry: expiry,
                verified: false,
            }) as unknown as UserAttributes;

            //send Email to user
            const html = emailHtml(otp);
            await mailSent(
                FromAdminMail,
                email,
                userSubject,
                html
            );

            //Generate a signature for user
            let signature = await GenerateSignature({
                id: newUser.id,
                email: newUser.email,
                verified: newUser.verified,
            });

            return res.status(201).json({
                message:
                    "User created successfully. Check your email for OTP verification",
                signature,
                verified: newUser.verified,
            });
        }
    } catch (err) {
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/user/signup",
        });
    }
};

/**===================================== VERIFY USER ===================================== **/
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { id, token } = req.params;

        // Find the user by ID
        const user = await UserInstance.findOne({
            where: { id: id },
        }) as unknown as UserAttributes;

        if (!user) {
            return res.status(404).json({
                error: "User with ID not found",
            });
        }
        // Verify the token
        // const secretKey = "APP_SECRET";
        // try {
        //   jwt.verify(token, APP_SECRET);
        // } catch (err) {
        //   return res.status(400).json({
        //     error: "Invalid or expired verification token",
        //   });
        // }

        // Check if the user is already verified
        if (user.verified === true) {
            return res.status(400).json({
                error: "User is already verified",
            });
        }

        // Update the user as verified
        await UserInstance.update({ verified: true }, { where: { id: id } });

        return res.status(200).json({
            message: "Email verification successful"
        });
    } catch (err) {
        res.status(500).json({
            error: "Internal server error",
            route: "/user/verify/:id",
        });
    }
};

/**===================================== LOGIN USER ===================================== **/
export const UserLogin = async (req: JwtPayload, res: Response) => {
    try {
        const { email, password } = req.body;

        const validateResult = UserLoginSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }

        //check if the User exist
        const User = await UserInstance.findOne({
            where: { email: email },
        }) as unknown as UserAttributes;

        if (User) {
            //Validate password
            const isValidPassword = await validatePassword(
                password,
                User.password,
                User.salt
            );

            if (isValidPassword) {
                //Generate signature for user
                let signature = await GenerateSignature({
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
            } else {
                res.status(400).json({
                    Error: "Wrong email or password",
                });
            }
        }
        return res.status(404).json({
            Error: `User with ${email} not found`,
        });
    } catch (err) {
        res.status(500).json({
            Error: "Internal server error", err,
            route: "/user/login",
        });
    }
};