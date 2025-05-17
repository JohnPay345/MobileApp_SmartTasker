import { TasksModel } from "../models/tasks.model.js";
import { replyResult } from "../service/duplicatePartsCode.js";

export const TasksController = {
  GetTasksByUserId: async (req, rep) => {
    const { userId } = req.params;
    if (!req.user.userId) {
      return rep.code(400).send({ code: 400, url: req.url, message: "User id is not found" })
    }
    try {
      const result = await TasksModel.GetTasks(req.user.userId);
      return replyResult(result);
    } catch (error) {
      console.error("Error at get tasks", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
  GetTaskById: async (req, rep) => {
    try {
      const { id } = req.params;
      if (!id) {
        return rep.code(400).send({ code: 400, url: req.url, message: "Id isn't found" })
      }
      const result = await TasksModel.GetTaskById(id);
      return replyResult(result);
    } catch (error) {
      console.error("Error at get task by id", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
  CreateTask: async (req, rep) => {
    const { id } = req.params;
    if (!req.body) {
      return rep.code(400).send({ code: 400, url: req.url, message: "To update, you need to change something" });
    }
    const { name, email, password, bio } = req.body;
    if (id !== req.user.userId) {
      return rep.code(400).send({ code: 400, url: req.url, message: "There is no access" });
    }
    try {
      return rep.code(200).send({ code: 200, url: req.url, result: "Success create new task" });
    } catch (error) {
      console.error("Error at create new task", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
  UpdateTaskById: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, result: "Success update task" });
    } catch (error) {
      console.error("Error at update task", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
  DeleteTaskById: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, result: "Success delete task" });
    } catch (error) {
      console.error("Error at delete task", error);
      return rep.code(500).send({ code: 500, url: req.url, message: "Internal Server Error" });
    }
  },
}
