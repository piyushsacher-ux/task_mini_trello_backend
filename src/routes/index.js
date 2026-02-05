const authRoutes = require("./auth.routes");
const projectRoutes = require("./project.routes");
const userRoutes = require("./user.routes");
const taskRoutes=require("./task.routes")

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/projects", projectRoutes);
  app.use("/users", userRoutes);
  app.use("/",taskRoutes);
};
