const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Circle App",
      version: "1.0.0",
      description: "API documentation for Circle App project",
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1",
      },
    ],
  },
  apis: ["./src/swagger/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
