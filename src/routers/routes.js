import express from "express";
import authRouter from "./auth.js";
import userRoute from "./user.route.js";
import userAppointmentRoute from "./userAppointment.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRoute);
router.use("/user-appointment", userAppointmentRoute);

export default router;
