import express from "express";
import { RegisterUser, verifyUser, UserLogin } from "../controller/userController";

const router = express.Router();

router.post('/signup', RegisterUser);
router.post('/verify/:id', verifyUser);
router.post('/login', UserLogin);

export default router;