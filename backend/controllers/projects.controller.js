export const ProjectsController = {
  GetProjects: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, result: "Success get projects" });
    } catch (error) {
      console.error("Error at get projects", error);
      return rep.code(500).send({ code: 500, url: req.url, errorMsg: "Internal Server Error" });
    }
  },
  GetProjectById: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, result: "Success get project by id" });
    } catch (error) {
      console.error("Error at get project by id", error);
      return rep.code(500).send({ code: 500, url: req.url, errorMsg: "Internal Server Error" });
    }
  },
  CreateProject: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, result: "Success create new project" });
    } catch (error) {
      console.error("Error at create new project", error);
      return rep.code(500).send({ code: 500, url: req.url, errorMsg: "Internal Server Error" });
    }
  },
  UpdateProjectById: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, result: "Success update project" });
    } catch (error) {
      console.error("Error at update project", error);
      return rep.code(500).send({ code: 500, url: req.url, errorMsg: "Internal Server Error" });
    }
  },
  DeleteProjectById: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, result: "Success delete project" });
    } catch (error) {
      console.error("Error at delete project", error);
      return rep.code(500).send({ code: 500, url: req.url, errorMsg: "Internal Server Error" });
    }
  },
}