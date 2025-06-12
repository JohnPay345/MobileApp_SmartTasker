import { Stack } from 'expo-router';
import { ThemeProvider } from '@src/context/ThemeContext';
import { SettingsProvider } from '@src/context/SettingsContext';
import { useFonts } from '@src/hooks/useFonts';
import { View, Text, StyleSheet } from 'react-native';
import { MainColors, TextColors } from '@/constants';

export default function RootLayout() {
  const { fontsLoaded } = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка шрифтов...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SettingsProvider>
        <Stack screenOptions={{
          headerShown: false,
          animation: 'none'
        }}>
          <Stack.Screen
            name='(auth)/login'
            options={{
              title: 'Вход',
            }}
          />
          <Stack.Screen
            name='(auth)/register'
            options={{
              title: 'Регистрация',
            }}
          />
          <Stack.Screen
            name='(tasks)/tasks'
            options={{
              title: 'Задачи',
            }}
          />
          <Stack.Screen
            name='(tasks)/[task_id]'
            options={{
              title: 'Задача',
            }}
          />
          <Stack.Screen
            name='(tasks)/create'
            options={{
              title: 'Создание задачи',
            }}
          />
          <Stack.Screen
            name='(projects)/projects'
            options={{
              title: 'Проекты',
            }}
          />
          <Stack.Screen
            name='(projects)/[project_id]'
            options={{
              title: 'Проект',
            }}
          />
          <Stack.Screen
            name='(projects)/create'
            options={{
              title: 'Создание проекта',
            }}
          />
          <Stack.Screen
            name='/profile'
            options={{
              title: 'Профиль',
            }}
          />
          <Stack.Screen
            name='/settings'
            options={{
              title: 'Настройки',
            }}
          />
        </Stack>
      </SettingsProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MainColors.pool_water,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: TextColors.snowbank,
    fontSize: 18,
  },
}); 