-- Создание базы данных
CREATE DATABASE "smartTasker" ENCODING UTF8;

-- Создание специального пользователя для работы с таблицами в БД
CREATE USER "worker1" WITH PASSWORD "s@ic5lyIK$tM";

-- Выдаём права на все таблицы в схеме public на пользователя worker1
GRANT SELECT, INSERT, UPDATE, DELETE, CONNECT ON ALL TABLES IN SCHEMA public TO "worker1";

-- Подключаемся к БД от пользователя worker1
\c "smartTasker" "worker1"

-- Enum для пола
CREATE TYPE gender_type AS ENUM ('Мужчина', 'Женщина');

-- Enum для статуса задачи
CREATE TYPE task_status_type AS ENUM ('Черновик', 'В работе', 'Выполнена', 'Неактуальна', 'Провалена');

-- Enum для статуса проекта
CREATE TYPE project_status_type AS ENUM ('Черновик', 'В работе', 'Выполнена', 'Неактуальна', 'Провален', 'Приостановлен');

-- Enum для приоритета
CREATE TYPE priority_type AS ENUM (1, 2, 3, 4, 5);

-- Enum для ценностей
CREATE TYPE value_type AS ENUM (1, 2, 3, 4, 5);

-- Enum для усилий
CREATE TYPE effort_type AS ENUM (1, 2, 3, 4, 5);

-- Создание таблицы roles (Роли пользователей)
CREATE TABLE roles (
  role_id UUID PRIMARY KEY DEFAULT uuid_generate_v5(uuid_generate_v4(), ((random() * (5160)::double precision))::text),
  role_name VARCHAR(50) UNIQUE NOT NULL,
);

-- Создание таблицы users (Пользователи/Сотрудники)
CREATE TABLE IF NOT EXISTS users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v5(uuid_generate_v4(), ((random() * (5160)::double precision))::text),
  first_name VARCHAR(100) NOT NULL, -- Фамилия
  middle_name VARCHAR(100), -- Имя
  last_name VARCHAR(100), -- Отчество
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20), -- Телефон
  birth_date DATE, -- День рождение
  start_date DATE, -- Начало работы
  gender gender_type NOT NULL, -- Используем ENUM для пола
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Последнее вход
  address TEXT, -- Адрес проживания
  job_title VARCHAR(255), -- Должность
  role_id UUID REFERENCES roles (role_id) NOT NULL --  UUID в ссылке на roles
  skills TEXT[] -- Массив навыков
  created_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Дата создания пользователя
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL, -- Дата обновления пользователя
);

-- Создание таблицы projects (Проекты)
CREATE TABLE projects IF NOT EXISTS (
  project_id UUID PRIMARY KEY DEFAULT uuid_generate_v5(uuid_generate_v4(), ((random() * (5160)::double precision))::text),
  project_name VARCHAR(255) NOT NULL, -- Название проекта
  description TEXT, -- Описание проекта
  start_date DATE DEFAULT NOW() NOT NULL, -- Дата начала проекта
  end_date DATE NOT NULL, -- Дата конца проекта (дедлайн)
  status project_status_type NOT NULL, -- Используем ENUM для статуса проекта
  created_by_user_id UUID REFERENCES users (user_id) NOT NULL, -- UUID в ссылке на users
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы tasks (Задачи)
CREATE TABLE tasks IF NOT EXISTS (
  task_id UUID PRIMARY KEY DEFAULT uuid_generate_v5(uuid_generate_v4(), ((random() * (5160)::double precision))::text),
  task_name VARCHAR(255) NOT NULL, -- Название задачи
  description TEXT, -- Описание задачи
  author_user_id UUID REFERENCES users (user_id) NOT NULL, -- UUID в ссылке на users
  project_id UUID REFERENCES projects (project_id) DEFAULT NULL, -- UUID в ссылке на projects
  deadline DATE, -- Крайний срок задачи
  status task_status_type NOT NULL, -- Используем ENUM для статуса задачи
  is_urgent BOOLEAN DEFAULT FALSE,
  priority priority_type NOT NULL, -- Используем ENUM для приоритета (или INT)
  value value_type NOT NULL, -- Используем ENUM для ценностей (или INT)
  effort effor_type NOT NULL, -- Используем ENUM для усилий (или INT)
  estimated_duration INT NOT NULL, -- Оценка срока
  priority_assessment INT NOT NULL, -- Оценка приориета
  qualification_assessment INT NOT NULL, -- Оценка квалификации
  load_assessment INT NOT NULL, -- Оценка нагрузки
  required_skills TEXT[], -- Массив навыков для задач
);

-- Создание таблицы task_assignments (Назначения задач пользователям)
CREATE TABLE task_assignments IF NOT EXISTS (
  task_assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (), -- UUID для назначения, генерируется автоматически
  task_id UUID REFERENCES tasks (task_id) ON DELETE CASCADE NOT NULL, -- UUID в ссылке на tasks
  user_id UUID REFERENCES users (user_id) ON DELETE CASCADE NOT NULL, -- UUID в ссылке на users
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Время назначения
  is_completed BOOLEAN DEFAULT FALSE, -- Выполнена задача или нет
  completed_at TIMESTAMP WITH TIME ZONE, -- Когда выполнили
  comments TEXT
);

-- Создание индексов для ускорения поиска (опционально, но рекомендуется)
CREATE INDEX idx_users_email ON users (email); -- Индекс по email
CREATE INDEX idx_tasks_status ON tasks (status); -- Индекс по статусу задачи
CREATE INDEX idx_tasks_project_id ON tasks (project_id); -- Индекс по project_id
CREATE INDEX idx_tasks_author_user_id ON tasks (author_user_id); -- Индекс по author_user_id
CREATE INDEX idx_task_assignments_task_id ON task_assignments (task_id); -- Индекс по task_id в task_assingments
CREATE INDEX idx_task_assignments_user_id ON task_assignments (user_id); -- Индекс по user_id в task_assingments
CREATE INDEX idx_task_assignments_is_completed ON task_assignments (is_completed); -- Индекс по is_completed в task_assingments