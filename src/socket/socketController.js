import Chat from "../models/chat.model.js";

export const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        const { userType, clinicId, patientId, patientName } = socket.handshake.auth;

        if (userType === "doctor" && clinicId) {
            socket.join(`clinic:${clinicId}`);
            console.log(`Doctor joined clinic room: clinic:${clinicId}`);
        } else if (userType === "patient" && clinicId && patientId) {
            const room = `chat:${clinicId}:${patientId}`;
            socket.join(room);
            console.log(`Patient ${patientName} joined ${room}`);
        }

        const handleMessageSend = async (data) => {
            try {
                const targetClinicId = data.clinicId || clinicId;
                const targetPatientId = data.patientId || patientId;

                if (targetPatientId && targetClinicId) {
                    const chatRoom = `chat:${targetClinicId}:${targetPatientId}`;

                    let chat = await Chat.findOne({ clinicId: targetClinicId, patientId: targetPatientId });
                    if (!chat) {
                        chat = new Chat({
                            clinicId: targetClinicId,
                            patientId: targetPatientId,
                            patientName: data.patientName || patientName || "Patient",
                            messages: []
                        });
                    }

                    const newMessage = {
                        sender: userType === "patient" ? "patient" : "doctor",
                        message: data.message,
                        timestamp: new Date(),
                        read: false
                    };

                    chat.messages.push(newMessage);
                    chat.lastMessage = newMessage;

                    if (userType === "patient") {
                        chat.unreadCount += 1;
                    } else {
                        chat.unreadCount = 0;
                    }

                    await chat.save();

                    if (userType === "patient") {
                        io.to(`clinic:${targetClinicId}`).emit("patient:message", {
                            patientId: targetPatientId,
                            patientName: chat.patientName,
                            ...newMessage
                        });
                        io.to(`clinic:${targetClinicId}`).emit("message:received", newMessage);
                    } else if (targetPatientId === "DHN-SUPPORT") {
                        io.to(`chat:${targetClinicId}:DHN-SUPPORT`).emit("message:received", newMessage);
                    } else {
                        io.to(chatRoom).emit("doctor:message", newMessage);
                        io.to(chatRoom).emit("message:received", newMessage);
                    }

                    socket.emit("message:sent", newMessage);
                }
            } catch (error) {
                console.error("Error in message:send:", error);
            }
        };

        socket.on("message:send", handleMessageSend);
        socket.on("doctor:message", handleMessageSend);
        socket.on("patient:message", handleMessageSend);

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
