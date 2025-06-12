import Fastify from 'fastify';
import { config } from "dotenv";
import path from "path";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import { routes } from "#routes/index.js";
import { __dirname } from '#root/utils/dirname.js';
import { webSocketService } from '#root/service/websocket.js';
import { pushConsumer } from '#rmq/consumers/pushConsumer.js';
import { createResources } from '#rmq/resourceCreator.js';
import { prototypeData } from '#root/prototype-data/index.js';

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

// Регистрация правил доступа к серверу
fastify.register(cors, {
  origin: [process.env.ORIGIN_V1, process.env.ORIGIN_V2, process.env.ORIGIN_V3],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
});

// Регистрируем все api пути
fastify.register(routes);

// Создание подключения брокера сообщений
createResources()
  .then(() => pushConsumer.startPushConsumer())
  .catch((err) => console.log(err));

// Настройка веб-сокета сервера
webSocketService.setupWebsocketServer(fastify.server);

// Инициализация данных
fastify.register(prototypeData);

fastify.listen({ port, host }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`)
});