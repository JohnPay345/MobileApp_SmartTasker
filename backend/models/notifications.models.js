import { pool } from "../service/connection.js";
import { updateDataInTable } from "../service/duplicatePartsCode.js";

export const NotificationsModel = {
  registerTokens: async (userId, deviceToken, deviceType, pushToken) => {
    try {
      const result = await pool.query(
        `INSERT INTO user_devices (user_id, device_type, device_token, push_token, created_at) VALUES ($1, $2, $3, $4, NOW()) \
        ON CONFLICT(user_id) DO UPDATE SET device_token = $3, push_token = $4 RETURNING device_id`,
        [userId, deviceType, deviceToken, pushToken]
      );
      if (!result.rows[0].length) {
        return { type: "errorMsg", errorMsg: "Error in register tokens" };
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model registerTokens" };
    }
  },
  getSettingsNotifications: async (userId) => {
    try {
      const result = await pool.query(
        `SELECT notifications_settings, notifications_settings_tasks, notifications_settings_projects \ 
        FROM "user_notifications_settings" WHERE user_id_notifications = $1`,
        [userId]
      );
      if (!result.rows[0].length) {
        return { type: "errorMsg", errorMsg: `Notifications settings for user ${userId} not found` };
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model Register" };
    }
  },
  createSettingsNotifications: async (userId, noticeSettings, noticeSettingsTasks, noticeSettingsProjects) => {
    try {
      const result = await pool.query(
        `INSERT INTO user_notifications_settings (user_id, notifications_settings, notifications_settings_tasks, notifications_settings_projects) \
        VALUES ($1, $2, $3, $3) RETURNING notifications_id`,
        [userId, noticeSettings, noticeSettingsTasks, noticeSettingsProjects]
      );
      if (!result.rows[0].length) {
        return { type: "errorMsg", errorMsg: "When tring write settings notifications an error has occured" };
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model Register" };
    }
  },
  updateSettingsNotifications: async (userId, noticeSettings, noticeSettingsTasks, noticeSettingsProjects) => {
    try {
      const data = {
        "notifications_settings": noticeSettings,
        "notifications_settings_tasks": noticeSettingsTasks,
        "notifications_settings_projects": noticeSettingsProjects,
      };
      const whereConditions = {
        "user_id": userId
      };
      const returningColumns = ["notifications_id"];
      const sql = updateDataInTable("user_notifications_settings", data, whereConditions, returningColumns);
      if (sql.type !== "Error") {
        return { type: "errorMsg", errorMsg: sql.message };
      }
      const result = await pool.query(sql.message, sql.values);
      if (!result.rows[0].length) {
        return { type: "errorMsg", errorMsg: `Couldn't update notifications settings for user ${userId}` };
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model Register" };
    }
  },
  saveInAppNotification: async (userId, eventType, title, body, notificationsData) => {
    try {
      const result = await pool.query(
        `INSERT INTO notifications (user_id, notification_type, notification_title, notification_body, \
        notification_data, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING notification_id`,
        [userId, eventType, title, body, JSON.stringify(notificationsData)]
      );
      if (!result.rows[0].length) {
        return { type: "errorMsg", errorMsg: `Failed to insert in-app notification for user ${userId}` }
      }
      return result.rows[0].id;
    } catch (error) {
      console.error('Error saving in-app notification:', error);
      return null;
    }
  },
}