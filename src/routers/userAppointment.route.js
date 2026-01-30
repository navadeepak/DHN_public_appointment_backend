import express from "express";
import {
  approveAppointment,
  createAppointment,
  getAllUserAppointments,
  getAppointmentsByClinic,
  getTargetedUserAppointments,
  rejectAppointment,
  rescheduleAppointment,
} from "../controllers/userAppointment.controller.js";

const userAppointmentRoute = express.Router();

userAppointmentRoute.post("/create", createAppointment);
userAppointmentRoute.get("/get-all", getAllUserAppointments);
userAppointmentRoute.get("/get/:id", getTargetedUserAppointments);
userAppointmentRoute.patch("/:id/approve", approveAppointment);
userAppointmentRoute.patch("/:id/reject", rejectAppointment);
userAppointmentRoute.patch(
  "/cd :id/reschedule",
  rescheduleAppointment
);
userAppointmentRoute.get("/clinic-appointments/:cid", getAppointmentsByClinic);

export default userAppointmentRoute;
