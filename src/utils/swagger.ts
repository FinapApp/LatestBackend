import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Flickstar Backend User Routes",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      contact: {
        name: "Flickstar",
        email: "krakshak@flickstar.net",
      },
    },
    servers: [
      {
        url: process.env.PROJECT_ENVIRONMENT === 'production'
          ? ""
          : "http://localhost:4003/api", 
        description: process.env.PROJECT_ENVIRONMENT === 'production'
          ? "Production Server"
          : "Local Server",
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
        bearerAuth: [
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElkIjoiNjZkYzNlMmFmMzJmYzg5M2QwOTlkODEwIiwiaWF0IjoxNzI1NzMzMTcwfQ.2hkYpjmQLwIwSSvVPTbA-c3rgo6Gc8aV4pbRIttAOkQ",
        ],
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
