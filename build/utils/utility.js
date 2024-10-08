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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateRandomPassword = exports.verifySignature = exports.GenerateSignature = exports.validatePassword = exports.GeneratePassword = exports.GenerateSalt = exports.TransactionSchema = exports.UserLoginSchema = exports.UserRegisterSchema = exports.option = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DB_config_1 = require("../DB.config");
exports.option = {
    abortEarly: false, /* means if there's an error in the first keys, it'll takecare of the error first before moving on to the next error  */
    errors: {
        wrap: { label: '' }
    }
};
exports.UserRegisterSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.UserLoginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    // password: Joi.string();
});
exports.TransactionSchema = joi_1.default.object().keys({
    amount: joi_1.default.number(),
    recipient_account_number: joi_1.default.string(),
    sender_account_number: joi_1.default.string(),
    description: joi_1.default.string(),
});
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
const validatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
});
exports.validatePassword = validatePassword;
const GenerateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(payload, DB_config_1.APP_SECRET, { expiresIn: '1d' });
});
exports.GenerateSignature = GenerateSignature;
const verifySignature = (signature) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.verify(signature, DB_config_1.APP_SECRET);
});
exports.verifySignature = verifySignature;
const GenerateRandomPassword = () => {
    const Password = Math.floor(Math.random() * 10000).toString();
    return Password;
};
exports.GenerateRandomPassword = GenerateRandomPassword;
