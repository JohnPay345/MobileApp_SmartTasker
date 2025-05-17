import { NotificationsModel } from "../models/notifications.models.js";
import { errorReplyCodes, replyResult } from "../service/duplicatePartsCode.js";

export const NotificationsController = {
  RegisterTokens: async (req, rep) => {
    try {
      const { userId, deviceToken, deviceType, pushToken } = req.body;
      const id = req.user.userId;
      if (!deviceToken || !deviceType || !pushToken) {
        return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
      }
      if (id !== userId) {
        return errorReplyCodes.reply403("DEFAULT", `There is no access for user ${userId}`);
      }
      const result = await NotificationsModel.registerTokens(userId, deviceToken, deviceType, pushToken);
      return replyResult(result);
    } catch (error) {
      console.error("Error at register tokens (device, push)", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  GetSettingsNotifications: async (req, rep) => {
    try {
      const { userId } = req.params;
      const id = req.user.userId;
      if (id !== userId) {
        return errorReplyCodes.reply403("DEFAULT", `There is no access for user ${userId}`);
      }
      const result = await NotificationsModel.getSettingsNotifications(userId);
      return replyResult(result);
    } catch (error) {
      console.error("Error at get settings notifications", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  CreateSettingsNotifications: async (req, rep) => {
    try {
      const { userId, noticeSettings, noticeSettingsTasks, noticeSettingsProjects } = req.body;
      const id = req.user.userId;
      if (!noticeSettings || !noticeSettingsTasks || !noticeSettingsProjects) {
        return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
      }
      if (id !== userId) {
        return errorReplyCodes.reply403("DEFAULT", `There is no access for user ${userId}`);
      }
      const result = await NotificationsModel.createSettingsNotifications(userId, noticeSettings, noticeSettingsTasks, noticeSettingsProjects);
      return replyResult(result);
    } catch (error) {
      console.error("Error at created settings notifications", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  UpdateSettingsNotifications: async (req, rep) => {
    try {
      const { userId, noticeSettings, noticeSettingsTasks, noticeSettingsProjects } = req.body;
      const id = req.user.userId;
      if (!noticeSettings || !noticeSettingsTasks || !noticeSettingsProjects) {
        return errorReplyCodes.reply400("MISSING_REQUIRED_FIELD");
      }
      if (id !== userId) {
        return errorReplyCodes.reply403("DEFAULT", `There is no access for user ${userId}`);
      }
      const result = await NotificationsModel.updateSettingsNotifications(userId, noticeSettings, noticeSettingsTasks, noticeSettingsProjects);
      return replyResult(result);
    } catch (error) {
      console.error("Error at update settings notifications", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  }
}