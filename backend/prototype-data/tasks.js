import { v4 } from "uuid";
import { UsersConfig } from "#root/prototype-data/users.js";

const tempTasksData = [
  {
    task_name: 'Создание прототипа приложения',
    description: 'Разработка прототипа мобильного приложения',
    author_id: '',
    project_id: '',
    goal_id: '',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'В работе',
    is_urgent: true,
    priority: '3',
    value: '3',
    effort: '3',
    estimated_duration: '1',
    priority_assessment: '2',
    qualification_assessment: '3',
    load_assessment: '4',
    required_skills: ['Мобильная разработка', 'UI/UX'],
  },
  {
    task_name: 'Анализ требований к CRM',
    description: 'Сбор и документирование требований к CRM-системе',
    author_id: '',
    project_id: '',
    goal_id: '',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'В работе',
    is_urgent: true,
    priority: '3',
    value: '3',
    effort: '3',
    estimated_duration: '1',
    priority_assessment: '2',
    qualification_assessment: '3',
    load_assessment: '4',
    required_skills: ['Бизнес анализ', 'CRM'],
  },
  {
    task_name: 'Дизайн главной страницы',
    description: 'Разработка дизайна главной страницы сайта',
    author_id: '',
    project_id: '',
    goal_id: '',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'В работе',
    is_urgent: true,
    priority: '3',
    value: '3',
    effort: '3',
    estimated_duration: '1',
    priority_assessment: '2',
    qualification_assessment: '3',
    load_assessment: '4',
    required_skills: ['Графический дизайн', 'Web-дизайн'],
  },
  {
    task_name: 'Настройка облачного хранилища',
    description: 'Конфигурация и тестирование облачного хранилища',
    author_id: '',
    project_id: '',
    goal_id: '',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'В работе',
    is_urgent: true,
    priority: '3',
    value: '3',
    effort: '3',
    estimated_duration: '1',
    priority_assessment: '2',
    qualification_assessment: '3',
    load_assessment: '4',
    required_skills: ['Облачные вычисления', 'Безопасность'],
  },
];

export const TasksConfig = {
  TasksData: new Map(),
  initializeTasks: async () => {
    let fillTaskData = new Map();
    const keys = Array.from(UsersConfig.UsersData.keys());
    let indexTasksData = 0;
    for (let user of UsersConfig.UsersData) {
      if (indexTasksData != tempTasksData.length) {
        const randomIndexUserUUID = Math.floor(Math.random() * keys.length);
        tempTasksData[indexTasksData].author_id = keys[randomIndexUserUUID];
        fillTaskData.set(v4(), tempTasksData[indexTasksData]);
        indexTasksData++;
      }
    }
    TasksConfig.TasksData = fillTaskData;
  },
  getTasks: async () => {
    return TasksConfig.TasksData;
  },
  setTask: async (data) => {
    return TasksConfig.TasksData.set(v4(), data);
  }
}