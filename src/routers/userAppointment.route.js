import express from "express";
import {
  approveAppointment,
  createAppointment,
  getAllUserAppointments,
  getAppointmentsByClinic,
  getTargetedUserAppointments,
  rejectAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from "../controllers/userAppointment.controller.js";

const userAppointmentRoute = express.Router();

userAppointmentRoute.post("/create", createAppointment);
userAppointmentRoute.get("/get-all", getAllUserAppointments);
userAppointmentRoute.get("/get/:id", getTargetedUserAppointments);
userAppointmentRoute.patch("/:id/approve", approveAppointment);
userAppointmentRoute.patch("/:id/reject", rejectAppointment);
userAppointmentRoute.patch("/:id/reschedule", rescheduleAppointment);
userAppointmentRoute.patch("/:id/cancel", cancelAppointment);
userAppointmentRoute.get("/clinic-appointments/:cid", getAppointmentsByClinic);

export default userAppointmentRoute;
