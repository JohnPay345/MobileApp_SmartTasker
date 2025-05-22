import { pool } from "../db/connection.js";
import { config } from "dotenv";
import { insertDataInTable, selectDataInTable } from "../service/duplicatePartsCode.js";

config();

export const ProjectsModel = {
  getProjects: async (userId) => {
    try {
      const options = {
        table: "projects",
        columns: ["project_id", "project_name", "project_description", "status", "author_id"],
        where: { "author_id": userId }
      }
      const sql = await selectDataInTable(options);
      if (sql.type == "Error") {
        return { type: "errorMsg", errorMsg: sql.message };
      }
      const result = await pool.query(sql.message, sql.values);
      if (!result.rows.length) {
        return { type: "errorMsg", errorMsg: "List projects not found" };
      }
      return { type: "result", result: result.rows }
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model getProjects" };
    }
  },
  getProjectById: async (projectId) => {
    try {
      const options = {
        table: [
          ["projects", "p"]
        ],
        columns: ["p.project_id", "p.project_name", "p.project_description", "p.start_date",
          "p.end_date", "p.status", "p.author_id", "p.tags", "pg.project_goal_id", "pg.goal_name",
          "pg.goal_description", "pg.target_date", "pg.goal_status", "pa.project_assignment_id", "pa.user_id"],
        join: [
          {
            table: [["project_goals", "pg"]],
            type: "LEFT JOIN",
            on: "p.project_id = pg.project_id"
          },
          {
            table: [["project_assignments", "pa"]],
            type: "LEFT JOIN",
            on: "p.project_id = pa.project_id"
          }
        ],
        where: { "p.project_id": projectId }
      };
      const sqlGetProjects = await selectDataInTable(options);
      if (sqlGetProjects.type == "Error") {
        return { type: "errorMsg", errorMsg: sqlGetProjects.message };
      }
      const result = await pool.query(sql.message, sql.values);
      if (!result.rows.length) {
        return { type: "errorMsg", errorMsg: "List projects not found" };
      }
      return { type: "result", result: result.rows }
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model getProjectsById" };
    }
  },
  createProject: async (data) => {
    try {
      const options = {
        table: "projects",
        data: data,
        columns: ["project_id", "project_name", "project_description", "status", "author_id"],
        where: { "author_id": userId }
      }
      const sql = await insertDataInTable(options);
      if (sql.type == "Error") {
        return { type: "errorMsg", errorMsg: sql.message };
      }
      const result = await pool.query();
      if (!result.rows.length) {
        return { type: "errorMsg", errorMsg: "The project has not been created" };
      }
      return { type: "result", result: result.rows }
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model createProject" };
    }
  },
  updateProjectById: async (projectId, data) => {
    try {
      if (!data.hasOwnProperty("project")) {
        return { type: "errorMsg", errorMsg: "Project data is required" };
      }
      const options = {
        tableName: "project",
        data: data.project,
        whereClause: { "project_id": projectId },
        requiredFields: ["project_name", "status", "author_id"],
        returningColumns: ["project_id"]
      }
      const sql = await updateDataInTable(options);
      if (sql.type == "Error") {
        return { type: "errorMsg", errorMsg: sql.message };
      }
      const resultUpdateTask = await pool.query(sql.message, sql.values);
      if (!resultUpdateTask.rows.length) {
        return { type: "errorMsg", errorMsg: "The project has not been updated" };
      }
      if (data.hasOwnProperty("assignments")) {
        const project_id = resultUpdateTask.rows[0].project_id;
        const usersId = data.assignments;
        const checkUsersExists = await pool.query("SELECT user_id FROM users WHERE user_id = ANY($1)", [usersId]);
        const existingUsersId = checkUsersExists.rows.map(row => row.user_id);
        const nonExistingUsers = usersId.filter(userId => !existingUsersId.includes(userId));
        if (nonExistingUsers.length > 0) {
          return { type: "errorMsg", errorMsg: `Users with id ${nonExistingUsers.join(', ')} do not exist` };
        }
        for (let userId of existingUsersId) {
          const resultTaskAssignments = await pool.query(`INSERT INTO projects_assignments (project_id, user_id, assigned_at, is_completed) \
              VALUES ($1, $2, DEFAULT, DEFAULT) RERURNING project_assignment_id`, [project_id, userId]);
          if (!resultTaskAssignments.rows.length) {
            console.error("Error when insert data to project_assignment_id table", resultTaskAssignments);
            return { type: "errorMsg", errorMsg: "Error when insert data to project_assignment_id table" };
          }
        }
        return { type: "result", result: `The project ${project_id} with assignments [${existingUsersId.join(", ")}] has been updated` }
      }
      return { type: "result", result: `The project ${projectId} has been updated` };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model updateProject" };
    }
  },
  deleteProjectById: async (projectId) => {
    try {
      const result = await pool.query("DELETE FROM projects WHERE project_id = $1 RETURNING project_id", [projectId])
      if (!result.rows.length) {
        return { type: "errorMsg", errorMsg: `Couldn't delete project ${projectId}` };
      }
      return { type: "result", result: result.rows[0] };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model deleteProject" };
    }
  },
}