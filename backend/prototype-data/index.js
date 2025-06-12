import { ProjectsConfig } from "#root/prototype-data/projects.js";
import { TasksConfig } from "#root/prototype-data/tasks.js";
import { UsersConfig } from "#root/prototype-data/users.js";
import { NotificationsConfig } from "#root/prototype-data/notifications.js";

export const prototypeData = (fastify, options, done) => {
  UsersConfig.initializeUsers()
    .then(value => TasksConfig.initializeTasks())
    .then(value => ProjectsConfig.initializeProjects())
    .then(value => NotificationsConfig.initializeNotifications())
    .catch(err => console.log(err));

  done();
}