const mongoose = require("mongoose");

const systemConfigSchema = new mongoose.Schema(
    {
        dbVersion: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SystemConfig", systemConfigSchema);
