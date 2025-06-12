import { ScrollView, StyleSheet } from "react-native";

export const ProjectTasksTab = () => {
  return (
    <ScrollView style={styles.tabContent}>
      {/* Здесь будут задачи проекта */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
});