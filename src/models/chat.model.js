import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: String, enum: ['patient', 'doctor'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const chatSchema = new mongoose.Schema({
    clinicId: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: { type: String },
    messages: [messageSchema],
    lastMessage: messageSchema,
    unreadCount: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Ensure unique chat session per clinic-patient pair
chatSchema.index({ clinicId: 1, patientId: 1 }, { unique: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
