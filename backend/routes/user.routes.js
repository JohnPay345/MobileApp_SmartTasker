import { UserController } from "../controllers/user.controller.js";
import { authenticateToken, verifyRefreshToken } from "../middleware/authentication.js";
import { uploadAvatars } from "../service/multer.js";

export const UserRoutes = (fastify, options, done) => {
  fastify.post("/register", UserController.register);
  fastify.post("/login", UserController.login);
  fastify.get("/users", { preHandler: authenticateToken }, UserController.getAllUsers);
  fastify.get("/users/:userId", { preHandler: authenticateToken }, UserController.getUserById);
  fastify.put("/users/:userId", { preHandler: authenticateToken, preHandler: uploadAvatars.single("avatar") }, UserController.updateUser);
  fastify.delete("/users/:userId", { preHandler: authenticateToken }, UserController.deleteUser);
  fastify.get("/updateTokens/:userId", { preHandler: verifyRefreshToken }, UserController.updateTokens)

  done();
}