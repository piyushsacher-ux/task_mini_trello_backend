require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const errorHandler = require("./errors/error.handler");
const { connectDB } = require("./config");
const registerChatSocket = require("./socket").registerChatSocket;
const { runMigrations } = require("./migrations/migrationRunner");

const { logger } = require("./utils");
const morgan = require("morgan");

const rateLimiter = require("./middleware").rateLimiter;


const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(rateLimiter.globalLimiter);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require("./routes")(app);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;  

const startServer = async () => {
  try {
    await connectDB();
    await runMigrations();
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
      }
    });
    registerChatSocket(io);

    server.listen(PORT, () => {
      logger.info(`Server running on ${PORT}`);

    });

  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
