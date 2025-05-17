import qs from "querystring";
import { __dirname } from "../utils/dirname.js";
import { TasksRoutes } from "./tasks.routes.js";
import { UserRoutes } from "./user.routes.js";
import { NotificationsRoutes } from "./notifications.routes.js";

export const routes = (fastify, options, done) => {
  // Нужен для парсинга body из запроса
  fastify.addContentTypeParser(
    "application/x-www-form-urlencoded",
    function (request, payload, done) {
      let body = "";
      payload.on("data", function (data) {
        body += data;
      });
      payload.on("end", function () {
        done(null, qs.parse(body));
      });
      payload.on("error", done);
    }
  );

  fastify.register(UserRoutes, { prefix: '/api' });
  fastify.register(TasksRoutes, { prefix: '/api' });
  fastify.register(NotificationsRoutes, { prefix: '/api' });
  done();
}