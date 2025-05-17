import bcrypt from 'bcrypt';
import { pool } from "../service/connection.js";
import { config } from "dotenv";
import { generateTokens, getFieldUser } from "../service/token.js";
config();

export const UserModel = {
  register: async (firstName, middleName, email, phone, password) => {
    try {
      const isUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (isUser.rows.length) {
        return { type: "errorMsg", errorMsg: "User already exists" };
      }
      const salt = await bcrypt.genSalt(12);
      const hashPass = await bcrypt.hash(password, salt);
      const avatarPath = '';
      const query = `INSERT INTO users(firstName, middleName, email, phone_number, password, gender, avatarPath, created_at, updated_at) 
      VALUES($1, $2, $3, $4, $5, DEFAULT, $6, NOW(), DEFAULT) RETURNING *`;
      const values = [firstName, middleName, email, phone_number, hashPass, avatarPath];
      const result = await pool.query(query, values);
      return { type: "result", result: result.rows[0] };
    } catch (error) {
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
  updateUser: async (id, name, email, password, bio) => {
    try {
      const isUser = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      if (!isUser) {
        return { type: "errorMsg", errorMsg: "User not found" }
      }
      if (password) {
        const salt = await bcrypt.genSalt(12);
        password = await bcrypt.hash(password, salt);
      }
      let user = { id, name, email, password, bio };
      let keys = Object.keys(user).filter(key => user[key] !== undefined);
      let updates = keys.map((key, index) => {
        return `${key} = $${++index}`;
      }).join(", ");
      let values = keys.map((key) => {
        return user[key];
      });
      const sqlUpdate = `UPDATE users SET ${updates}, update_user = DEFAULT WHERE id = $1 RETURNING *`;
      const result = await pool.query(sqlUpdate, values);
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      console.log(error)
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