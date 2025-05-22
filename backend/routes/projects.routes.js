import { ProjectsController } from "../controllers/projects.controller";
import { authenticateToken, verifyRefreshToken } from "../middleware/authentication.js";

export const ProjectsRouter = (fastify, options, done) => {
  fastify.get("/projects/:userId/list", ProjectsController.GetProjects);
  fastify.get("/projects/:userId/:projectId", ProjectsController.GetProjectById);
  fastify.post("/projects/:userId", ProjectsController.CreateProject);
  fastify.put("/projects/:userId/:projectId", ProjectsController.UpdateProjectById);
  fastify.delete("/projects/:userId/:projectId", ProjectsController.DeleteProjectById);

  done();
}