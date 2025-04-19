import {UserModel} from "../models/user.model.js";
import {setDate} from "../service/date.js";

export const UserController = {
  register: async (req, rep) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return rep.code(400).send({url: req.url, errorMsg: "All fields are required"});
    }
    try {
      const result = await UserModel.register(name, email, password);
      switch (result.type) {
        case "result":
          return rep.code(200).send(result.result)
        case "errorMsg":
          return rep.code(400).send({url: req.url, errorMsg: result.errorMsg});
        default: {
          return rep.code(500).send({url: req.url, errorMsg: "An unpredictable error"});
        }
      }
    } catch (error) {
      console.error("Error at registration", error);
      return rep.code(500).send({url: req.url, errorMsg: "Internal Server Error"});
    }
  },
  login: async (req, rep) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return rep.code(400).send({url: req.url, errorMsg: "All fields are required"});
    }
    try {
      const result = await UserModel.login(email, password);
      switch (result.type) {
        case "result":
          rep.header("Set-Cookie", `refresh_token=${result.result.refresh_token};Expires=${setDate(30).toUTCString()};HttpOnly;`);
          return rep.code(200).send({message: result.result.access_token});
        case "errorMsg":
          return rep.code(400).send({url: req.url, errorMsg: result.errorMsg});
        default: {
          return rep.code(500).send({url: req.url, errorMsg: "An unpredictable error"});
        }
      }
    } catch (error) {
      console.error("Error at login", error);
      return rep.code(500).send({url: req.url, errorMsg: "Internal Server Error"});
    }
  },
  getAllUsers: async (req, rep) => {
    try {
      const result = await UserModel.getAllUsers();
      switch (result.type) {
        case "result":
          return rep.code(200).send(result.result);
        case "errorMsg":
          return rep.code(400).send({url: req.url, errorMsg: result.errorMsg});
        default: {
          return rep.code(500).send({url: req.url, errorMsg: "An unpredictable error"});
        }
      }
    } catch (error) {
      console.error("Error at get all users", error);
      return rep.code(500).send({url: req.url, errorMsg: "Internal Server Error"});
    }
  },
  getUserById: async (req, rep) => {
    const { id } = req.params;
    if(!id) {
      return rep.code(400).send({url: req.url, errorMsg: "Id isn't found"})
    }
    try {
      const result = await UserModel.getUserById(id);
      switch (result.type) {
        case "result":
          return rep.code(200).send(result.result);
        case "errorMsg":
          return rep.code(400).send({url: req.url, errorMsg: result.errorMsg});
        default: {
          return rep.code(500).send({url: req.url, errorMsg: "An unpredictable error"});
        }
      }
    } catch (error) {
      console.error("Error at get user by id", error);
      return rep.code(500).send({url: req.url, errorMsg: "Internal Server Error"});
    }
  },
  updateUser: async (req, rep) => {
    const { id } = req.params;
    if(!req.body) {
      return rep.code(400).send({url: req.url, errorMsg: "To update, you need to change something"});
    }
    const { name, email, password, bio } = req.body;
    if (id !== req.user.userId) {
      return rep.code(400).send({url: req.url, errorMsg: "There is no access"});
    }
    try {
      const result = await UserModel.updateUser(id, name, email, password, bio);
      switch (result.type) {
        case "result":
          return rep.code(200).send(result.result);
        case "errorMsg":
          return rep.code(400).send({url: req.url, errorMsg: result.errorMsg});
        default: {
          return rep.code(500).send({url: req.url, errorMsg: "An unpredictable error"});
        }
      }
    } catch (error) {
      console.error("Error at update user", error);
      return rep.code(500).send({url: req.url, errorMsg: "Internal Server Error"});
    }
  },
  deleteUser: async (req, rep) => {
    const { id } = req.params;
    if (id !== req.user.userId) {
      return rep.code(400).send({url: req.url, errorMsg: "There is no access"});
    }
    try {
      const result = await UserModel.deleteUser(id);
      switch (result.type) {
        case "result":
          return rep.code(200).send({message: result.result});
        case "errorMsg":
          return rep.code(400).send({url: req.url, errorMsg: result.errorMsg});
        default: {
          return rep.code(500).send({url: req.url, errorMsg: "An unpredictable error"});
        }
      }
    } catch (error) {
      console.error("Error at deleted user", error);
      return rep.code(500).send({url: req.url, errorMsg: "Internal Server Error"});
    }
  },
  updateTokens: async (req, rep) => {
    const {id} = req.params;
    const authHeader = req.headers["cookie"];
    if(!authHeader) {
      return rep.code(401).send({url: req.url, errorMsg: "Invalid Token"});
    }
    if(id !== req.user.userId) {
      return rep.code(400).send({error: "There is no access"});
    }
    try {
      const result = await UserModel.updateTokens(id, authHeader);
      switch (result.type) {
        case "result":
          rep.header("Set-Cookie", `refresh_token=${result.result.refresh_token};Expires=${setDate(30).toUTCString()};HttpOnly;`);
          return rep.code(200).send({message: result.result.access_token});
        case "errorMsg":
          return rep.code(400).send({url: req.url, errorMsg: result.errorMsg});
        default: {
          return rep.code(500).send({url: req.url, errorMsg: "An unpredictable error"});
        }
      }
    } catch (error) {
      console.error("Error at update tokens", error);
      return rep.code(500).send({url: req.url, errorMsg: "Internal Server Error"});
    }
  }
}
