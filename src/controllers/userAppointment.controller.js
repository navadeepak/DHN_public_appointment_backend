import userAppointmentModel from "../models/userAppointment.model.js";

export const createAppointment = async (req, res) => {
  try {
    const collectedData = req.body;
    const data = await userAppointmentModel.create(collectedData);
    res
      .status(200)
      .json({ message: "Appointment Created Successfully!", data: data });
  } catch (error) {
    res.status(200).json(error);
  }
};

export const getAllUserAppointments = async (req, res) => {
  try {
    const data = await userAppointmentModel.find();
    res
      .status(200)
      .json({ message: "Appointments Fetched Successfully!", data: data });
  } catch (error) {
    res.status(200).json(error);
  }
};

export const getTargetedUserAppointments = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await userAppointmentModel.find({ patientId: id });
    res
      .status(200)
      .json({ message: "Appointments Fetched Successfully!", data: data });
  } catch (error) {
    res.status(200).json(error);
  }
};

// ────────────────────────────────────────────────
// 1. Approve appointment
// ────────────────────────────────────────────────
export const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params; // appointment _id

    const appointment = await userAppointmentModel.findByIdAndUpdate(
      id,
      { $set: { status: "approve" } },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment approved successfully!",
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to approve appointment",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────
// 2. Reject appointment
// ────────────────────────────────────────────────
export const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await userAppointmentModel.findByIdAndUpdate(
      id,
      { $set: { status: "reject" } },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment rejected successfully!",
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to reject appointment",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────
// 3. Reschedule appointment
// ────────────────────────────────────────────────
export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params; // appointment _id
    const { appointmentDate, selectedSlot } = req.body;

    if (!appointmentDate || !selectedSlot) {
      return res.status(400).json({
        message:
          "Both appointmentDate and selectedSlot are required for rescheduling",
      });
    }

    const appointment = await userAppointmentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          appointmentDate,
          selectedSlot,
          status: "pending", // usually reset to pending after reschedule
          // Optional: you can add rescheduledAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment rescheduled successfully!",
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to reschedule appointment",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────
// 4. Get all appointments for a specific clinic (by cid)
// ────────────────────────────────────────────────
export const getAppointmentsByClinic = async (req, res) => {
  try {
    const { cid } = req.params;

    const appointments = await userAppointmentModel.find({ cid }).sort({
      appointmentDate: 1,
      selectedSlot: 1, // optional - sort by date then time
    });

    return res.status(200).json({
      message: "Clinic appointments fetched successfully!",
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch clinic appointments",
      error: error.message,
    });
  }
};
