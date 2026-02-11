import Patient from "../models/patient.model.js";

export const syncPatientRegistrationController = async (req, res) => {
    try {
        const { clinicId, DHN_ID, name, email, phone } = req.body;

        if (!clinicId || !DHN_ID) {
            return res.status(400).json({ message: "Clinic ID and DHN_ID are required" });
        }

        // 1. Find or Update Patient
        let patient = await Patient.findOne({ clinicId, DHN_ID });

        if (!patient && (email || phone)) {
            const query = { clinicId, isDeleted: false };
            if (email && phone) {
                query.$or = [{ patientEmail: email }, { patientPhone: phone }];
            } else if (email) {
                query.patientEmail = email;
            } else {
                query.patientPhone = phone;
            }

            patient = await Patient.findOne(query);
            if (patient) {
                patient.DHN_ID = DHN_ID;
                await patient.save();
            }
        }

        if (!patient) {
            const count = await Patient.countDocuments({ clinicId });
            const patientId = `HUB-PT-${count + 1}`;

            patient = new Patient({
                clinicId,
                patientId,
                DHN_ID,
                patientName: name,
                patientEmail: email,
                patientPhone: phone
            });
            await patient.save();
        }

        return res.status(200).json({
            message: "Patient synced successfully",
            patient: {
                patientId: patient.patientId,
                patientName: patient.patientName,
                clinicId: patient.clinicId
            }
        });
    } catch (err) {
        console.error("Sync error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
