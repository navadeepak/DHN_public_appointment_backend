import express from "express";
import { getTargetedUser, updateUser } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const userRoute = express.Router();

userRoute.get("/get/:id", authenticateToken, getTargetedUser);
userRoute.patch("/update/:id", authenticateToken, updateUser);

export default userRoute;
