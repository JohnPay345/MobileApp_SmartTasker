import { config } from "dotenv";
import { pool } from "../service/connection.js";
import { insertDataInTable, selectDataInTable, updateDataInTable } from "../service/duplicatePartsCode.js";

config();

export const TasksModel = {
  getTasksByUserId: async (userId) => {
    try {
      const options = {
        table: "tasks",
        columns: ["task_id, task_name, author_id, project_id, \
          start_date, end_date, status, is_urgent, priority"],
        where: { "author_id": userId }
      }
      const sql = await selectDataInTable(options);
      if (sql.type == "Error") {
        return { type: "errorMsg", errorMsg: sql.message };
      }
      const result = await pool.query(sql.message, sql.values);
      if (!result.rows.length) {
        return { type: "errorMsg", errorMsg: "List task not found" };
      }
      return { type: "result", result: result.rows };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model getTasks" };
    }
  },
  getTaskById: async (taskId) => {
    try {
      const options = {
        table: "tasks",
        columns: ["task_id, task_name, description, author_id, project_id, \
          start_date, end_date, status, is_urgent, priority, value, effort, \
          estimated_duration, priority_assessment, qualification_assessment, \
          load_assessment, required_skills"],
        where: { "task_id": taskId }
      }
      const sql = await selectDataInTable(options);
      if (sql.type == "Error") {
        return { type: "errorMsg", errorMsg: sql.message };
      }
      const result = await pool.query(sql.message, sql.values);
      if (!result.rows.length) {
        return { type: "errorMsg", errorMsg: "Task not found" };
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model getTaskById" };
    }
  },
  createTask: async (data) => {
    try {
      if (!data.hasOwnProperty("task")) {
        return { type: "errorMsg", errorMsg: "Task data is required" };
      }
      const options = {
        tableName: "tasks",
        data: data.task,
        requiredFields: ["task_name, author_id, start_date, status, priority, \
          value, effort, estimated_duration, priority_assessment, qualification_assessment, \
          load_assessment"],
        returningColumns: ["task_id"]
      }
      const sql = await insertDataInTable(options);
      if (sql.type == "Error") {
        return { type: "errorMsg", errorMsg: sql.message };
      }
      const resultCreateTask = await pool.query(sql.message, sql.values);
      if (!resultCreateTask.rows.length) {
        return { type: "errorMsg", errorMsg: "The task has not been created" };
      }
      if (data.hasOwnProperty("assignments")) {
        const taskId = resultCreateTask.rows[0].task_id;
        const usersId = data.assignments;
        const checkUsersExists = await pool.query("SELECT user_id FROM users WHERE user_id = ANY($1)", [usersId]);
        const existingUsersId = checkUsersExists.rows.map(row => row.user_id);
        const nonExistingUsers = usersId.filter(userId => !existingUsersId.includes(userId));
        if (nonExistingUsers.length > 0) {
          return { type: "errorMsg", errorMsg: `Users with ids ${nonExistingUsers.join(', ')} do not exist` };
        }
        for (let userId of existingUsersId) {
          const resultTaskAssignments = await pool.query(`INSERT INTO task_assignments (task_id, user_id, assigned_at, is_completed) \
          VALUES ($1, $2, DEFAULT, DEFAULT) RERURNING task_assignment_id`, [taskId, userId]);
          if (!resultTaskAssignments.rows.length) {
            console.error("Error when insert data to task_assignment_id table", resultTaskAssignments);
            return { type: "errorMsg", errorMsg: "Error when insert data to task_assignment_id table" };
          }
        }
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model createTask" };
    }
  },
  updateTaskById: async (taskId, data) => {
    try {
      if (!data.hasOwnProperty("task")) {
        return { type: "errorMsg", errorMsg: "Task data is required" };
      }
      const options = {
        tableName: "tasks",
        data: data.task,
        whereClause: { "task_id": taskId },
        requiredFields: ["task_name, author_id, start_date, status, priority, \
          value, effort, estimated_duration, priority_assessment, qualification_assessment, \
          load_assessment"],
        returningColumns: ["task_id"]
      }
      const sql = await updateDataInTable(options);
      if (sql.type == "Error") {
        return { type: "errorMsg", errorMsg: sql.message };
      }
      const resultUpdateTask = await pool.query(sql.message, sql.values);
      if (!resultUpdateTask.rows.length) {
        return { type: "errorMsg", errorMsg: "The task has not been updated" };
      }
      if (data.hasOwnProperty("assignments")) {
        const taskId = resultUpdateTask.rows[0].task_id;
        const usersId = data.assignments;
        const checkUsersExists = await pool.query("SELECT user_id FROM users WHERE user_id = ANY($1)", [usersId]);
        const existingUsersId = checkUsersExists.rows.map(row => row.user_id);
        const nonExistingUsers = usersId.filter(userId => !existingUsersId.includes(userId));
        if (nonExistingUsers.length > 0) {
          return { type: "errorMsg", errorMsg: `Users with ids ${nonExistingUsers.join(', ')} do not exist` };
        }
        for (let userId of existingUsersId) {
          const resultTaskAssignments = await pool.query(`INSERT INTO task_assignments (task_id, user_id, assigned_at, is_completed) \
          VALUES ($1, $2, DEFAULT, DEFAULT) RERURNING task_assignment_id`, [taskId, userId]);
          if (!resultTaskAssignments.rows.length) {
            console.error("Error when insert data to task_assignment_id table", resultTaskAssignments);
            return { type: "errorMsg", errorMsg: "Error when insert data to task_assignment_id table" };
          }
        }
      }
      const result = await pool.query(sql.message, sql.values);
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model updateTask" };

    }
  },
  deleteTaskById: async (taskId) => {
    try {
      const result = await pool.query("DELETE FROM tasks WHERE task_id = $1 RETURNING task_id", [taskId])
      if (!result.rows.length) {
        return { type: "errorMsg", errorMsg: `Couldn't delete task ${taskId}` };
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model deleteTask" };
    }
  },
}