import { UserModel } from "../models/user.model.js";
import { setDate } from "../utils/date.js";
import { replyResult } from "../service/duplicatePartsCode.js";

export const UserController = {
  register: async (req, rep) => {
    const { firstName, middleName, email, phone, password } = req.body;
    if (!firstName || !middleName || !email || !phone || !password) {
      return rep.code(400).send({ code: 400, url: req.url, message: "All fields are required" });
    }
    try {
      const result = await UserModel.register(firstName, middleName, email, phone, password);
      return replyResult(result);
    } catch (error) {
      console.error("Error at registration", error);
      return rep.code(500).send({ code: 200, url: req.url, message: "Internal Server Error" });
    }
  },
  login: async (req, rep) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return rep.code(400).send({ code: 400, url: req.url, message: "All fields are required" });
    }
    try {
      const result = await UserModel.login(email, password);
      switch (result.type) {
        case "result":
          rep.header("Set-Cookie", `refresh_token=${result.result.refresh_token};Expires=${setDate(30).toUTCString()};HttpOnly;`);
          return rep.code(200).send({ code: 200, url: req.url, result: result.result.access_token });
        case "errorMsg":
          return rep.code(400).send({ code: 400, url: req.url, message: result.errorMsg });
        default: {
          return rep.code(500).send({ code: 500, url: req.url, message: "An unpredictable error" });
        }
      }
    } catch (error) {
      console.error("Error at login", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
  getAllUsers: async (req, rep) => {
    try {
      const result = await UserModel.getAllUsers();
      return replyResult(result);
    } catch (error) {
      console.error("Error at get all users", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
  getUserById: async (req, rep) => {
    const { id } = req.params;
    if (!id) {
      return rep.code(400).send({ code: 400, url: req.url, message: "Id isn't found" })
    }
    try {
      const result = await UserModel.getUserById(id);
      return replyResult(result);
    } catch (error) {
      console.error("Error at get user by id", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
  updateUser: async (req, rep) => {
    const { id } = req.params;
    if (!req.body) {
      return rep.code(400).send({ code: 400, url: req.url, message: "To update, you need to change something" });
    }
    const { name, email, password, bio } = req.body;
    if (id !== req.user.userId) {
      return rep.code(403).send({ code: 403, url: req.url, message: "There is no access" });
    }
    try {
      const result = await UserModel.updateUser(id, name, email, password, bio);
      return replyResult(result);

    } catch (error) {
      console.error("Error at update user", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
  deleteUser: async (req, rep) => {
    const { id } = req.params;
    if (id !== req.user.userId) {
      return rep.code(400).send({ code: 400, url: req.url, message: "There is no access" });
    }
    try {
      const result = await UserModel.deleteUser(id);
      return replyResult(result);

    } catch (error) {
      console.error("Error at deleted user", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
  updateTokens: async (req, rep) => {
    const { id } = req.params;
    const authHeader = req.headers["cookie"];
    if (!authHeader) {
      return rep.code(401).send({ code: 401, url: req.url, message: "Invalid Token" });
    }
    if (id !== req.user.userId) {
      return rep.code(400).send({ code: 400, url: req.url, message: "There is no access" });
    }
    try {
      const result = await UserModel.updateTokens(id, authHeader);
      switch (result.type) {
        case "result":
          rep.header("Set-Cookie", `refresh_token=${result.result.refresh_token};Expires=${setDate(30).toUTCString()};HttpOnly;`);
          return rep.code(200).send({ code: 200, url: req.url, result: result.result.access_token });
        case "errorMsg":
          return rep.code(400).send({ code: 400, url: req.url, message: result.errorMsg });
        default: {
          return rep.code(500).send({ code: 500, url: req.url, message: "An unpredictable error" });
        }
      }
    } catch (error) {
      console.error("Error at update tokens", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  }
}
