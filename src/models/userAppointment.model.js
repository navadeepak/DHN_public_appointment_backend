import mongoose from "mongoose";

const userAppointmentSchema = mongoose.Schema(
  {
    cid: { type: String, require: true },
    patientId: { type: String, require: true },
    patientName: { type: String, require: true },
    patientPhno: { type: String, require: true },
    patientEmail: { type: String },
    appointmentDate: { type: String, require: true },
    selectedSlot: { type: String, require: true },
    clinicName: { type: String, require: true },
    docName: { type: String, require: true },
    subdomainName: { type: String, require: true },
    clinicLocation: { type: String, require: true },
    clinicNumber: { type: String },
    status: { type: String, default: "pending" },
    reschedules: {
      type: [
        {
          previousDate: String,
          previousSlot: String,
          newDate: String,
          newSlot: String,
          rescheduledBy: String,
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamp: true }
);

export default mongoose.model("userAppointment", userAppointmentSchema);
