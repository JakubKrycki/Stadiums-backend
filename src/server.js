import Inert from "@hapi/inert";
import Hapi from "@hapi/hapi";
import HapiSwagger from "hapi-swagger";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import path from "path";
import dotenv from "dotenv";
import Joi from "joi";
import { fileURLToPath } from "url";
import Cookie from "@hapi/cookie";
import jwt from "hapi-auth-jwt2";
import hapiBasic from "hapi-auth-basic";
import hapiAuthorization from "hapi-authorization";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { apiRoutes } from "./api-routes.js";
import { validate } from "./api/jwt-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

const swaggerOptions = {
  info: {
    title: "Stadiums API",
    version: "2.0"
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header"
    }
  },
  security: [{ jwt: [] }]
};

const plugins = [
  {
      plugin: hapiBasic,
  },
  {
      plugin: hapiAuthorization,
      options: {
        roles: false,
      },
  }
];

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    routes: { cors: { origin: ["*"]} },
  });


  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(jwt);
  await server.register(plugins);

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.validator(Joi);

  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });

  server.auth.strategy("jwt", "jwt", {
    key: process.env.cookie_password,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] }
  });
  server.auth.default("session");
  
  db.init("mongo");
  server.route(webRoutes);
  server.route(apiRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
