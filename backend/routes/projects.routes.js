import { ProjectsController } from "../controllers/projects.controller";
import { authenticateToken, verifyRefreshToken } from "../middleware/authentication.js";

export const ProjectsRouter = (fastify, options, done) => {
  fastify.get("/projects", ProjectsController.GetProjects);
  fastify.get("/projects/:id", ProjectsController.GetProjectById);
  fastify.post("/projects", ProjectsController.CreateProject);
  fastify.put("/projects/:id", ProjectsController.UpdateProjectById);
  fastify.delete("/projects/:id", ProjectsController.DeleteProjectById);

  done();
}