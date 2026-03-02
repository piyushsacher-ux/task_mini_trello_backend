const { StatusCodes } = require("http-status-codes");
const Project = require("../models/project.model");
const chatService = require("../services/chat.service");
const socketAuth = require("./socket.auth");

const registerChatSocket = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user._id.toString());

    /**
     * Join project room
     */
    socket.on("joinProject", async (projectId) => {
      console.log("joinProject triggered", projectId);
      try {
        if (!projectId) {
          return socket.emit("chatError", {
            status: StatusCodes.BAD_REQUEST,
            message: "Project ID is required",
          });
        }
        const project = await Project.findById(projectId).select("members");

        if (!project) {
          return socket.emit("chatError", {
            status: StatusCodes.NOT_FOUND,
            message: "Project not found",
          });
        }

        // Check membership
        const isMember = project.members.some((memberId) => memberId.toString() === socket.user._id.toString());

        if (!isMember) {
          return socket.emit("chatError", {
            status: StatusCodes.FORBIDDEN,
            message: "Not authorized",
          });
        }

        socket.join(projectId);
        socket.emit("joinedProject", projectId);

      } catch (error) {
        socket.emit("chatError", {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Failed to join project",
        });
      }
    });

    /**
     * Send message
     */
    socket.on("sendMessage", async ({ projectId, content }) => {
      try {
        if (!projectId || !content) {
          return socket.emit("chatError", {
            status: StatusCodes.BAD_REQUEST,
            message: "Project ID and content are required",
          });
        }
        const message = await chatService.createMessage({
          projectId,
          senderId: socket.user._id,
          content,
        });

        io.to(projectId).emit("receiveMessage", message);

      } catch (error) {
        socket.emit("chatError", {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Failed to send message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user._id.toString());
    });
  });
};

module.exports = registerChatSocket;