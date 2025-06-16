import { UserModel } from "#models/user.model.js";
import { setDate } from "#root/utils/date.js";
import { errorReplyCodes, replyResult } from "#root/service/duplicatePartsCode.js";

export const UserController = {
  register: async (req, rep) => {
    if (!req.body) {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
    }
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
    }
    try {
      const result = await UserModel.register(data);
      return replyResult(result);
    } catch (error) {
      console.error("Error at registration", error);
      return errorReplyCodes.reply500("DEFAULT")
    }
  },
  login: async (req, rep) => {
    if (!req.body) {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
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
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  getAllUsers: async (req, rep) => {
    try {
      const result = await UserModel.getAllUsers();
      return replyResult(result);
    } catch (error) {
      console.error("Error at get all users", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  getUserById: async (req, rep) => {
    const { userId } = req.params;
    const reqUserId = req.user.userId;
    if (userId !== reqUserId) {
      return errorReplyCodes.reply403("DEFAULT", `There no access for user ${userId}`);
    }
    try {
      const result = await UserModel.getUserById(id);
      return replyResult(result);
    } catch (error) {
      console.error("Error at get user by id", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  updateUser: async (req, rep) => {
    const { userId } = req.params;
    const reqUserId = req.user.userId;
    let filePath = "";
    if (userId !== reqUserId) {
      return errorReplyCodes.reply403("DEFAULT", `There no access for user ${userId}`);
    }
    if (!req.body) {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
    }
    const { data } = req.body;
    if (!data || typeof data !== "object") {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
    }
    if (req.file && req.file.path) {
      filePath = req.file.path;
    }
    if (filePath) {
      data.user.avatarPath = `/uploads/avatars/${filePath}`;
    }
    try {
      const result = await UserModel.updateUser(userId, data);
      return replyResult(result);
    } catch (error) {
      console.error("Error at update user", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  deleteUser: async (req, rep) => {
    const { userId } = req.params;
    const reqUserId = req.user.userId;
    if (userId !== reqUserId) {
      return errorReplyCodes.reply400("DEFAULT", `There no access for user ${userId}`);
    }
    try {
      const result = await UserModel.deleteUser(id);
      return replyResult(result);
    } catch (error) {
      console.error("Error at deleted user", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  updateTokens: async (req, rep) => {
    const { userId } = req.params;
    const reqUserId = req.user.userId;
    const authHeader = req.headers["cookie"];
    if (!authHeader) {
      return errorReplyCodes.reply401("EXPIRED_TOKEN");
    }
    if (userId !== reqUserId) {
      return errorReplyCodes.reply403("DEFAULT", `There no access for user ${userId}`);
    }
    try {
      const result = await UserModel.updateTokens(userId, authHeader);
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
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  getUserStats: async (req, rep) => {
    const { userId } = req.params;
    const reqUserId = req.user.userId;
    if (userId !== reqUserId) {
      return errorReplyCodes.reply403("DEFAULT", `There no access for user ${userId}`);
    }
    try {
      const statsResult = await UserModel.getUserStats(userId);
      if (statsResult.type === "errorMsg") {
        return rep.code(400).send({ 
          code: 400, 
          url: req.url, 
          message: statsResult.errorMsg 
        });
      }
      const activityResult = await UserModel.getUserRecentActivity(userId);
      if (activityResult.type === "errorMsg") {
        return rep.code(400).send({ 
          code: 400, 
          url: req.url, 
          message: activityResult.errorMsg 
        });
      }
      const performanceResult = await UserModel.getUserPerformance(userId);
      if (performanceResult.type === "errorMsg") {
        return rep.code(400).send({ 
          code: 400, 
          url: req.url, 
          message: performanceResult.errorMsg 
        });
      }
      return rep.code(200).send({
        code: 200,
        url: req.url,
        result: {
          stats: statsResult.result,
          recentActivity: activityResult.result,
          performance: performanceResult.result
        }
      });
    } catch (error) {
      console.error("Error at get user statistics:", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  }
}
