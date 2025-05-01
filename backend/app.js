import Fastify from 'fastify';
import { config } from "dotenv";
import { routes } from "./routes/index.js";

config();

const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';
const fastify = Fastify({
  logger: {
    transport: {
      level: "info",
      target: "pino-pretty",
      options: {
        colorize: true,
        customColors: "error:bgRedBright,info:bgGreenBright"
      }
    }
  },
});

fastify.register(routes);

fastify.listen({ port, host }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});