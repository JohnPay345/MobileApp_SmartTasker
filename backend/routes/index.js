import {UserRoutes} from "./user.routes.js";
import qs from "querystring";

export const routes = (fastify, options, done) => {
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

  fastify.register(UserRoutes, {prefix: '/api'});
  done();
}