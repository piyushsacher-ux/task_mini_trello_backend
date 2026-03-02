const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true, 
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional future proofing
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

/**
 * Compound index
 * This makes project-based chat queries extremely fast
 */
messageSchema.index({ project: 1, createdAt: 1 });

module.exports= mongoose.model("Message", messageSchema);
