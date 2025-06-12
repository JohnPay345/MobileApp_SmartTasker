import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { GetTaskStatusColor, MainColors, TextColors } from '@/constants';
import { router } from 'expo-router';
import { TaskStatus } from '@src/types/statuses';
import { HeaderEditor } from '@src/components/HeaderEditor';
import { Ionicons } from '@expo/vector-icons';
import { ProjectInfoTab } from '@src/tabs/projects/ProjectInfoTab';
import { ProjectTasksTab } from '@src/tabs/projects/ProjectTasksTab';
import { ProjectGoalsTab } from '@src/tabs/projects/ProjectGoalsTab';
import { TabsComponent, Tab } from '@src/components/TabsComponent';

type ProjectMode = 'create' | 'view' | 'edit';

interface ProjectScreenProps {
  projectId?: string;
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({ projectId }) => {
  const [mode, setMode] = useState<ProjectMode>(projectId ? 'view' : 'create');
  const isEditable = mode === 'create' || mode === 'edit';

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // TODO: Сохранение задачи
    router.back();
  };

  const handleDelete = () => {
    // TODO: Удаление задачи
    router.back();
  };

  const handleEdit = () => {
    setMode('edit');
  };

  const getStatusTextColor = (status: TaskStatus): string => {
    if (status === 'Выполнена' || status === 'В работе') {
      return TextColors.dire_wolf;
    }
    return TextColors.snowbank;
  }

  const getStatusColor = (status: TaskStatus): string => {
    const color = GetTaskStatusColor[status] ? GetTaskStatusColor[status] : TextColors.dim_gray;
    return color;
  }

  return (
    <View style={styles.container}>
      <HeaderEditor onBack={handleBack} onSave={handleSave} />

      <View style={styles.content}>
        <TabsComponent
          activeTab={0}
          onTabChange={(index) => console.log('Tab changed:', index)}
        >
          <Tab
            label="Свойства"
            icon={<Ionicons name="information-circle-outline" size={24} color={MainColors.pool_water} />}
          >
            <ProjectInfoTab />
          </Tab>
          <Tab
            label="Цели"
            icon={<Ionicons name="flag-outline" size={24} color={MainColors.pool_water} />}
          >
            <ProjectGoalsTab />
          </Tab>
          <Tab
            label="Задачи"
            icon={<Ionicons name="list-outline" size={24} color={MainColors.pool_water} />}
            badge={3}
          >
            <ProjectTasksTab />
          </Tab>
        </TabsComponent>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MainColors.white,
  },
  content: {
    flex: 1,
  },
});