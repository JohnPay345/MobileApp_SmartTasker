import Fastify from 'fastify';
import { config } from "dotenv";
import path from "path";
import { routes } from "./routes/index.js";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { __dirname } from './utils/dirname.js';
import { setupWebsocketServer } from './service/websocket.js';
import { RabbitMQ_Config } from './rabbitmq/rabbitmq_config.js';
import { pushConsumer } from './rabbitmq/consumers/pushConsumer.js';

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
    },
  },
});

// Регистрация кодировки multipart/form-data
fastify.register(fastifyMultipart);

// Регистрация пути к статическим файлам из сервера
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads'
});

// Регистрируем все api пути
fastify.register(routes);

RabbitMQ_Config.connectRabbitMQ()
  .then(() => {
    pushConsumer.startPushConsumer();
  })
  .catch((err) => console.log(err));

// Настройка веб-сокета сервера
setupWebsocketServer(fastify);

fastify.listen({ port, host }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`)
});