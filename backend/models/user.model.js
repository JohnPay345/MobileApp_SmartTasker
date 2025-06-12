import bcrypt from 'bcrypt';
import { config } from "dotenv";
import { generateTokens, getFieldUser } from "#root/service/token.js";
import { __dirname } from "#root/utils/dirname.js";
import { generateAvatar } from '#root/service/generateAvatar.js';
import { insertDataInTable, updateDataInTable } from '#root/service/duplicatePartsCode.js';
config();

export const UserModel = {
  register: async (data) => {
    try {
      await pool.query("BEGIN");
      if (!data.hasOwnProperty("user")) {
        throw new Error("User data is required");
      }
      const isUser = await pool.query("SELECT * FROM users WHERE email = $1", [data.user.email]);
      if (isUser.rows.length) {
        throw new Error("User already exists");
      }
      const salt = await bcrypt.genSalt(12);
      data.user.password = await bcrypt.hash(data.user.password, salt);
      const { firstName, middleName } = data.user;
      const fullName = `${firstName}-${middleName}`;
      const fileName = `${Date.now()}-${fullName}.svg`;
      const filePath = path.join(__dirname, 'uploads', 'avatars', fileName);
      const avatarPath = `uploads/avatars/${fileName}`;
      const options = {
        tableName: "users",
        data: data.user,
        requiredFields: ["firstName", "middleName", "email", "phone_number", "password", "gender",
          "avatarPath", "created_at", "updated_at"],
        returningColumns: ["user_id"]
      }
      const sqlRegister = await insertDataInTable(options);
      if (sqlRegister.type == "Error") {
        throw new Error(sqlRegister.message);
      }
      const result = await pool.query(sqlRegister.message, sqlRegister.values);
      if (result.rows[0].user_id) {
        await generateAvatar(fullName, filePath);
      } else {
        throw new Error("The user has not been created");
      }
      if (!data.hasOwnProperty("user_device")) {
        throw new Error("User data device is required");
      }
      const resultUserDevice = await pool.query("INSERT INTO user_devices(user_id, device_type, device_token, \
         created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), DEFAULT) RETURNING device_id", [userId, data.user_device.device_type, data.user_device.device_token]);
      const resultUserNotificationsSettings = await pool.query("INSERT INTO user_notifications_settings(user_id) \
        VALUES($1) RETURNING notifications_id", [result.rows[0].user_id]);
      if (!resultUserDevice.rowCount || !resultUserNotificationsSettings.rowCount) {
        throw new Error("Query to the tables (user_devices, user_notifications_settings) not was executed");
      }
      await pool.query("COMMIT");
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      if (error instanceof Error) {
        return { type: "errorMsg", errorMsg: error.message };
      }
      return { type: "errorMsg", errorMsg: "Error in Model Register" };
    }
  },
  login: async (email, password) => {
    try {
      const isUser = await pool.query("SELECT user_id, email, password FROM users WHERE email = $1", [email]);
      if (!isUser.rows.length) {
        return { type: "errorMsg", errorMsg: "Wrong email or password" };
      }
      const isPassword = await bcrypt.compare(password, isUser.rows[0].password);
      if (!isPassword) {
        return { type: "errorMsg", errorMsg: "Wrong email or password" };
      }
      const { id } = isUser.rows[0];
      const fullName = `${isUser.rows[0].firstName} ${isUser.rows[0].middleName}`;
      const tokens = generateTokens({ userId: id, fullName });
      return { type: "result", result: tokens }
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model Login" };
    }
  },
  getAllUsers: async () => {
    try {
      const result = await pool.query(`SELECT user_id, firstName, middleName,
        lastName, email, phone_number, birth_date,
        start_date, gender, address, job_title,
        last_login, skills FROM users`);
      return { type: "result", result: result.rows };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model GetAllUsers" }
    }
  },
  getUserById: async (id) => {
    try {
      const result = await pool.query(`SELECT user_id, firstName, middleName,
        lastName, email, phone_number, birth_date,
        start_date, gender, address, job_title,
        last_login, skills FROM users WHERE id = $1`,
        [id]);
      if (!result.rows.length) {
        return { type: "errorMsg", errorMsg: "User not found" };
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model GetUserById" };
    }
  },
  updateUser: async (userId, data) => {
    try {
      await pool.query("BEGIN");
      if (!data.hasOwnProperty("user")) {
        throw new Error("User data is required");
      }
      const isUser = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
      if (!isUser) {
        throw new Error("User not found");
      }
      if (data.user.password) {
        const salt = await bcrypt.genSalt(12);
        data.user.password = await bcrypt.hash(password, salt);
      }
      const options = {
        tableName: "users",
        data: data.user,
        whereClause: { "user_id": userId },
        requiredFields: ["first_name", "middle_name", "email", "password", "gender", "updated_at"],
        returningColumns: ["user_id"]
      }
      const sql = await updateDataInTable(options);
      if (sql.type == "Error") {
        throw new Error(sql.message);
      }
      const resultUpdateUser = await pool.query(sql.message, sql.values);
      if (!resultUpdateUser.rows.length) {
        throw new Error("The user has not been updated");
      }
      await pool.query("COMMIT");
      return { type: "result", result: resultUpdateUser.rows[0] };
    } catch (error) {
      console.log(error);
      await poll.query("ROLLBACK");
      if (error instanceof Error) {
        return { type: "errorMsg", errorMsg: error.message };
      }
      return { type: "errorMsg", errorMsg: "Error in Model updateUser" };
    }
  },
  deleteUser: async (id) => {
    try {
      const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      if (!user.rows.length) {
        return { type: "errorMsg", errorMsg: "User not found" };
      }
      const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
      return { type: "result", result: "User has been deleted" };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model deleteUser" };
    }
  },
  updateTokens: async (id, authHeader) => {
    const result = await pool.query("SELECT id, name FROM users WHERE id = $1", [id]);
    if (!result.rows.length) {
      return { type: "errorMsg", errorMsg: "User not found" };
    }
    let payload = getFieldUser(authHeader, ['userId', 'name']);
    if (id !== payload.userId) {
      return { type: "errorMsg", errorMsg: "Invalid id" };
    }
    try {
      const { id, name } = result.rows[0];
      const tokens = generateTokens({ userId: id, name });
      return { type: "result", result: tokens };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model updateTokens" };
    }
  }
}