import Fastify from "fastify";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import fastifyStatic from "@fastify/static";
import userRoutes from "./routes/userRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { prisma as db } from "./services/db.js";
import { backupDatabase } from "./services/backupService.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import cron from "node-cron";

const PUBLIC_URL = process.env.PUBLIC_URL;
const PUBLIC_HOST = process.env.PUBLIC_HOST;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastifyOptions = {
  ajv: {
    customOptions: {
      removeAdditional: true,
    },
  },
};

if (process.env.FASTIFY_HTTPS === "true") {
  fastifyOptions.https = {
    key: fs.readFileSync(path.join(__dirname, "ssl/private.key")),
    cert: fs.readFileSync(path.join(__dirname, "ssl/certificate.crt")),
  };
}

const fastify = Fastify(fastifyOptions);

fastify.register(fastifySwagger, {
  openapi: {
    info: {
      title: "DoCode API",
      description: "API de base pour DoCode.",
      version: "1.0.0",
    },
    host: PUBLIC_HOST,
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    components: {
      securitySchemes: {
        token: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "jwt",
        },
      },
    },
  },
});

fastify.register(fastifySwaggerUI, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "list",
  },
});

fastify.register(fastifyCors, {
  origin: PUBLIC_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

fastify.register(fastifyMultipart, {
  limits: { fileSize: 20 * 1024 * 1024 },
});

fastify.register(userRoutes, { prefix: "/api/users" });
fastify.register(pageRoutes, { prefix: "/api/pages" });

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../frontend/build"),
  prefix: "/",
  wildcard: true,
  decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/",
});

fastify.setNotFoundHandler((request, reply) => {
  reply.sendFile("index.html", path.join(__dirname, "../frontend/build"));
});

function keepDatabaseAlive() {
  db.$queryRaw`SELECT 1`
    .then(() => {
      console.log("Ping à la base de données réussi");
    })
    .catch((err) => {
      console.error("Erreur lors du ping de la base de données :", err.message);
    });
}

setInterval(keepDatabaseAlive, 25200000);

const backupDayOfWeek = process.env.BACKUP_DAY_OF_WEEK || "0";
const backupTime = process.env.BACKUP_TIME || "00:00";
const [hours, minutes] = backupTime.split(":");

cron.schedule(`${minutes} ${hours} * * ${backupDayOfWeek}`, () => {
  console.log("Démarrage de la sauvegarde hebdomadaire...");
  backupDatabase()
    .then(({ filePath }) => {
      fastify.log.info(`Sauvegarde créée avec succès : ${filePath}`);
    })
    .catch((error) => {
      fastify.log.error(`Erreur lors de la sauvegarde : ${error.message}`);
    });
});

const start = async () => {
  try {
    console.log(`Starting server on port ${process.env.PORTS}...`);
    await fastify.listen({ port: process.env.PORTS, host: "0.0.0.0" });
    console.log(`Server listening on ${process.env.PUBLIC_URL}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

start();
