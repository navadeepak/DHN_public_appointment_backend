import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        DHN_ID: { type: String },
        clinicId: { type: String },
        isDeleted: { type: Boolean, default: false },
        patientId: { type: String, required: true },
        patientName: { type: String, required: true },
        patientPhone: { type: String },
        patientAddress: { type: String },
        patientEmail: { type: String },
        patientDOB: { type: String },
        patientGender: { type: String },
        patientAge: { type: String },
        patientAadhar: { type: String },
    },
    {
        timestamps: true,
    }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
