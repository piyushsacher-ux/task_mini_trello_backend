const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const projectRoutes = require("./project.routes");
const taskRoutes = require("./task.routes");
const messageRoutes = require("./message.route");

module.exports = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/projects", projectRoutes);
  app.use("/api/v1", taskRoutes);
  app.use("/api/v1/messages", messageRoutes);
};
