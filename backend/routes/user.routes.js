import { UserController } from "../controllers/user.controller.js";
import { authenticateToken, verifyRefreshToken } from "../middleware/authentication.js";

export const UserRoutes = (fastify, options, done) => {
  fastify.post("/register", UserController.register);
  fastify.post("/login", UserController.login);
  fastify.get("/users", { preHandler: authenticateToken }, UserController.getAllUsers);
  fastify.get("/users/:id", { preHandler: authenticateToken }, UserController.getUserById);
  fastify.put("/users/:id", { preHandler: authenticateToken }, UserController.updateUser);
  fastify.delete("/users/:id", { preHandler: authenticateToken }, UserController.deleteUser);
  fastify.get("/updateTokens/:id", { preHandler: verifyRefreshToken }, UserController.updateTokens)

  done();
}