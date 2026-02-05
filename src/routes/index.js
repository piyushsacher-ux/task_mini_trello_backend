const authRoutes = require("./auth.routes");
const projectRoutes = require("./project.routes");
const userRoutes = require("./user.routes");

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/projects", projectRoutes);
  app.use("/users", userRoutes);
};
