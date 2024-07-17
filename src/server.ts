import fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import {
  confirmParticipant,
  confirmTrip,
  createActivity,
  createInvite,
  createLink,
  createTrip,
  getActivities,
  getLinks,
  getParticipant,
  getParticipants,
  getTripDetails,
  updateTrip,
} from "./routes";
import { errorHandler } from "./errors/error-handler";
import { env } from "./env";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(swagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Test swagger",
      description: "Testing the Fastify swagger API",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      { name: "user", description: "User related end-points" },
      { name: "code", description: "Code related end-points" },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
      },
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(swaggerUI, {
  routePrefix: "/documentation",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(createTrip);
app.register(confirmParticipant);
app.register(confirmTrip);
app.register(createActivity);
app.register(createInvite);
app.register(createLink);
app.register(getActivities);
app.register(getLinks);
app.register(getParticipant);
app.register(getParticipants);
app.register(getTripDetails);
app.register(updateTrip);

app.listen({ port: 3333 }).then(() => {
  console.log("⚡ Server running!");
});
