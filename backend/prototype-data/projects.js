import { v4 } from "uuid";
import { UsersConfig } from "#root/prototype-data/users.js";

const tempProjectsData = [
  {
    project_name: 'Разработка мобильного приложения',
    description: 'Создание мобильного приложения для заказа еды',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'В работе',
    author_id: '',
    tags: ['Мобильное приложение', 'Еда', 'Доставка'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    project_name: 'Редизайн корпоративного сайта',
    description: 'Обновление дизайна и функционала корпоративного сайта',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'В работе',
    author_id: '',
    tags: ['Web', 'Дизайн', 'UI/UX'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    project_name: 'Внедрение CRM-системы',
    description: 'Интеграция CRM для управления клиентами и продажами',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'Завершён',
    author_id: '',
    tags: ['CRM', 'Продажи', 'Автоматизация'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    project_name: 'Миграция на облачные сервисы',
    description: 'Перенос инфраструктуры в облачное хранилище',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'В работе',
    author_id: '',
    tags: ['Облако', 'Инфраструктура', 'Безопасность'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const ProjectsConfig = {
  ProjectsData: new Map(),
  initializeProjects: async () => {
    let fillProjectsData = new Map();
    const keys = Array.from(UsersConfig.UsersData.keys());
    let indexProjectsData = 0;
    for (let user of UsersConfig.UsersData) {
      if (indexProjectsData != tempProjectsData.length) {
        const randomIndexUserUUID = Math.floor(Math.random() * keys.length);
        tempProjectsData[indexProjectsData].author_id = keys[randomIndexUserUUID];
        fillProjectsData.set(v4(), tempProjectsData[indexProjectsData]);
        indexProjectsData++;
      }
    }
    ProjectsConfig.ProjectsData = fillProjectsData;
  },
  getProjects: async () => {
    return ProjectsConfig.ProjectsData;
  },
  setProject: async (data) => {
    return ProjectsConfig.ProjectsData.set(v4(), data);
  }
}