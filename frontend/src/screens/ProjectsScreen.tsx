import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainColors, TextColors } from '@/constants';
import { ProjectItem } from '@src/components/ProjectItem';
import { BurgerMenu } from '@src/components/BurgerMenu';
import { router } from 'expo-router';

type ProjectStatus = 'В работе' | 'Выполнена' | 'Сдана' | 'Провален' | 'Неактуально' | 'Приостановлен' | 'Черновик';

interface Project {
  id: number;
  title: string;
  tasksCount: number;
  completedTasks: number;
  deadline: string;
  status: ProjectStatus;
}

export const ProjectsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    // TODO: Заменить на запрос к API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProjects([
        {
          id: 1,
          title: 'Разработка мобильного приложения',
          tasksCount: 12,
          completedTasks: 5,
          deadline: '01.03.2024',
          status: 'В работе'
        },
        {
          id: 2,
          title: 'Редизайн веб-сайта',
          tasksCount: 8,
          completedTasks: 8,
          deadline: '15.03.2024',
          status: 'Выполнена'
        },
        {
          id: 3,
          title: 'Интеграция платежной системы',
          tasksCount: 6,
          completedTasks: 2,
          deadline: '10.02.2024',
          status: 'Провален'
        },
        {
          id: 4,
          title: 'Обновление документации',
          tasksCount: 4,
          completedTasks: 1,
          deadline: '20.03.2024',
          status: 'Неактуально'
        },
      ]);
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Проекты</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={30} color={MainColors.pool_water} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск"
            placeholderTextColor="#868686"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={30} color={MainColors.pool_water} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={MainColors.pool_water} />
          <Text style={styles.loadingText}>Загрузка проектов...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {projects.map(project => (
            <ProjectItem
              key={project.id}
              title={project.title}
              tasksCount={project.tasksCount}
              completedTasks={project.completedTasks}
              deadline={project.deadline}
              status={project.status}
              onPress={() => { router.push(`/projects/${project.id}`) }}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsMenuOpen(true)}
        >
          <Ionicons name="menu" size={35} color={MainColors.pool_water} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {/* Add new project */ }}
        >
          <Ionicons name="add" size={35} color={MainColors.pool_water} />
        </TouchableOpacity>
      </View>

      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: MainColors.white,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: TextColors.dim_gray,
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.4)',
  },
  headerTitle: {
    fontSize: 20,
    color: TextColors.dire_wolf,
    fontFamily: 'Century-Regular',
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInputContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MainColors.snowbank,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    color: '#868686',
    fontSize: 16,
    fontFamily: 'Century-Regular',
  },
  filterButton: {
    padding: 8,
  },
  content: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: MainColors.pool_water,
    fontSize: 14,
    fontFamily: 'Century-Regular',
  },
  bottomNav: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: MainColors.pool_water,
    borderRadius: 50,
  },
});