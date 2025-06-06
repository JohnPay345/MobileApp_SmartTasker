import { ProjectsModel } from "#models/projects.models.js";
import { errorReplyCodes, replyResult } from "#root/service/duplicatePartsCode.js";

export const ProjectsController = {
  GetProjects: async (req, rep) => {
    const { userId } = req.params;
    const reqUserId = req.user.userId;
    if (reqUserId !== userId) {
      return errorReplyCodes.reply403("DEFAULT", `There no acces for user ${userId}`);
    }
    try {
      const result = await ProjectsModel.getProjects(userId);
      return replyResult(result);
    } catch (error) {
      console.error("Error at get projects", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  GetProjectById: async (req, rep) => {
    const { userId, projectId } = req.params;
    const reqUserId = req.user.userId;
    if (reqUserId !== userId) {
      return errorReplyCodes.reply403("DEFAULT", `There no acces for user ${userId}`);
    }
    try {
      const result = await ProjectsModel.getProjectById(projectId);
      return replyResult(result);
    } catch (error) {
      console.error("Error at get project by id", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  CreateProject: async (req, rep) => {
    const { userId } = req.params;
    const reqUserId = req.user.userId;
    if (reqUserId !== userId) {
      return errorReplyCodes.reply403("DEFAULT", `There no acces for user ${userId}`);
    }
    if (!req.body) {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
    }
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
    }
    try {
      const result = await ProjectsModel.createProject(data)
      return replyResult(result);
    } catch (error) {
      console.error("Error at create new project", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  UpdateProjectById: async (req, rep) => {
    const { userId, projectId } = req.params;
    const reqUserId = req.user.userId;
    if (reqUserId !== userId) {
      return errorReplyCodes.reply403("DEFAULT", `There no acces for user ${userId}`);
    }
    if (!req.body) {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
    }
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
    }
    try {
      const result = await ProjectsModel.updateProjectById(projectId, data);
      return replyResult(result);
    } catch (error) {
      console.error("Error at update project", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  DeleteProjectById: async (req, rep) => {
    const { userId, projectId } = req.params;
    const reqUserId = req.user.userId;
    if (reqUserId !== userId) {
      return errorReplyCodes.reply403("DEFAULT", `There no acces for user ${userId}`);
    }
    try {
      const result = await ProjectsModel.deleteProjectById(projectId)
      return replyResult(result);
    } catch (error) {
      console.error("Error at delete project", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
}