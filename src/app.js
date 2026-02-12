require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const errorHandler = require("./errors/error.handler");
const { connectDB } = require("./config");
const rateLimiter = require("./middleware").rateLimiter;

const app = express();

app.set('trust proxy',1);
app.use(cors());
app.use(express.json());
app.use(rateLimiter.globalLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require("./routes")(app);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
