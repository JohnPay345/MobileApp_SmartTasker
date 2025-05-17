import { NotificationsController } from "../controllers/notifications.controller.js";
import { authenticateToken, verifyRefreshToken } from "../middleware/authentication.js";

export const NotificationsRoutes = (fastify, options, done) => {
  fastify.post("/notifications/register-tokens", NotificationsController.RegisterTokens);
  fastify.get("/notifications/settings/:user_id", NotificationsController.GetSettingsNotifications);
  fastify.get("/notifications/inbox/:user_id", NotificationsController.GetSettingsNotifications);
  fastify.post("/notifications/settings/:user_id", NotificationsController.CreateSettingsNotifications);
  fastify.put("/notifications/settings/:user_id", NotificationsController.UpdateSettingsNotifications);

  done();
}