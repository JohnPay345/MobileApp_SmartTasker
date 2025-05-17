import { pool } from "../service/connection.js";
import { config } from "dotenv";

config();

export const TasksModel = {
  GetTasks: async (userId) => {
    try {
      const result = await pool.query("SELECT * FROM tasks WHERE author_user_id = $1)", [userId]);
      return { type: "result", result: result.rows };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model GetTasks" };
    }
  },
  GetTaskById: async (taskId) => {
    try {
      const result = await pool.query(`SELECT * FROM tasks WHERE task_id = $1`, [taskId]);
      if (!result.rows.length) {
        return { type: "errorMsg", errorMsg: "Task not found" };
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model GetTaskById" };
    }
  },
  CreateTask: async (data) => {

  },
  UpdateTask: async (taskId) => {

  },
  DeleteTask: async (taskId) => {

  },
}