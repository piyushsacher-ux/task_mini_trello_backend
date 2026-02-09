const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "Mini Jira / Trello Backend",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "API v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [path.join(__dirname, "swagger/*.js")],
};

module.exports = swaggerJsdoc(options);
