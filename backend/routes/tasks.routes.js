import { TasksController } from "../controllers/tasks.controller.js";
import { authenticateToken, verifyRefreshToken } from "../middleware/authentication.js";

export const TasksRoutes = (fastify, options, done) => {
  fastify.get("/tasks/:userId/list", TasksController.GetTasksByUserId);
  fastify.get("/tasks/:id", TasksController.GetTaskById);
  fastify.post("/tasks", TasksController.CreateTask);
  fastify.put("/tasks/:id", TasksController.UpdateTaskById);
  fastify.delete("/tasks/:id", TasksController.DeleteTaskById);

  done();
}