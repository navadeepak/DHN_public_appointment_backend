import Chat from "../models/chat.model.js";

export const getChatHistory = async (req, res) => {
    try {
        const { clinicId, patientId } = req.params;
        const chat = await Chat.findOne({ clinicId, patientId });
        res.status(200).json(chat ? chat.messages : []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getActiveSessions = async (req, res) => {
    try {
        const { clinicId } = req.params;
        const sessions = await Chat.find({ clinicId, isArchived: false })
            .select("patientId patientName lastMessage unreadCount updatedAt")
            .sort({ updatedAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
