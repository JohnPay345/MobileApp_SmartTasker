import { v4 } from "uuid";
import { UsersConfig } from "#root/prototype-data/users.js";

const tempNotificationsData = [
  {
    user_id: "",
    notification_type: "task_assigned",
    notification_title: "Вам назначена новая задача",
    notification_body: "Вам назначена задача 'Создание прототипа приложения'. Пожалуйста, приступайте к выполнению.",
    notification_data: {
      task_name: "Создание прототипа приложения",
      project_name: "Разработка мобильного приложения"
    },
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    user_id: "",
    notification_type: "project_updated",
    notification_title: "Обновлен статус проекта",
    notification_body: "Статус проекта 'Редизайн корпоративного сайта' изменен на 'in progress'.",
    notification_data: {
      project_name: "Редизайн корпоративного сайта",
      new_status: "in progress"
    },
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    user_id: "",
    notification_type: "task_completed",
    notification_title: "Задача завершена",
    notification_body: "Задача 'Анализ требований к CRM' успешно завершена.",
    notification_data: {
      task_name: "Анализ требований к CRM"
    },
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    user_id: "",
    notification_type: "project_start",
    notification_title: "Проект стартовал",
    notification_body: "Проект 'Миграция на облачные сервисы' начался.",
    notification_data: {
      project_name: "Миграция на облачные сервисы"
    },
    is_read: false,
    created_at: new Date().toISOString()
  }
];

export const NotificationsConfig = {
  NotificationsData: new Map(),
  initializeNotifications: async () => {
    let fillNotificationsData = new Map();
    const keys = Array.from(UsersConfig.UsersData.keys());
    let indexNotificationsData = 0;
    for (let [key, value] of UsersConfig.UsersData.entries()) {
      if (indexNotificationsData != tempNotificationsData.length) {
        tempNotificationsData[indexNotificationsData].user_id = key;
        fillNotificationsData.set(v4(), tempProjectsData[indexNotificationsData]);
        indexNotificationsData++;
      }
      if (indexNotificationsData == tempNotificationsData.length) {
        indexNotificationsData = 0;
      }
    }
    NotificationsConfig.NotificationsData = fillNotificationsData;
  },
  getNotifications: async () => {
    return NotificationsConfig.NotificationsData;
  },
  setNotification: async (data) => {
    return NotificationsConfig.NotificationsData.set(v4(), data)
  }
}