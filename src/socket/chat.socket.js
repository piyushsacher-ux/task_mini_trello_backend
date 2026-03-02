const { StatusCodes } = require("http-status-codes");
const Project = require("../models/project.model");
const chatService = require("../services/chat.service");
const socketAuth = require("./socket.auth");

const registerChatSocket = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user._id.toString());

    /**
     * Utility: Check Project Access
     */
    const checkProjectAccess = async (projectId, userId) => {
      const project = await Project.findById(projectId)
        .select("members owner createdBy");

      if (!project) {
        return { error: "Project not found", status: StatusCodes.NOT_FOUND };
      }

      const userIdStr = userId.toString();

      const isMember =
        project.members?.some(
          (memberId) => memberId.toString() === userIdStr
        ) || false;

      const isOwner =
        project.owner?.toString() === userIdStr;

      const isCreator =
        project.createdBy?.toString() === userIdStr;

      if (!isMember && !isOwner && !isCreator) {
        return { error: "Not authorized", status: StatusCodes.FORBIDDEN };
      }

      return { project };
    };

    /**
     * Join project room
     */
    socket.on("joinProject", async (projectId) => {
      try {
        if (!projectId) {
          return socket.emit("chatError", {
            status: StatusCodes.BAD_REQUEST,
            message: "Project ID is required",
          });
        }

        const { error, status } = await checkProjectAccess(
          projectId,
          socket.user._id
        );

        if (error) {
          return socket.emit("chatError", {
            status,
            message: error,
          });
        }

        socket.join(projectId);
        socket.emit("joinedProject", projectId);

      } catch (error) {
        console.error("Join Error:", error);
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
        if (!projectId || !content?.trim()) {
          return socket.emit("chatError", {
            status: StatusCodes.BAD_REQUEST,
            message: "Project ID and content are required",
          });
        }

        const { error, status } = await checkProjectAccess(
          projectId,
          socket.user._id
        );

        if (error) {
          return socket.emit("chatError", {
            status,
            message: error,
          });
        }

        const message = await chatService.createMessage({
          projectId,
          senderId: socket.user._id,
          content: content.trim(),
        });

        io.to(projectId).emit("receiveMessage", message);

      } catch (error) {
        console.error("Send Message Error:", error);
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