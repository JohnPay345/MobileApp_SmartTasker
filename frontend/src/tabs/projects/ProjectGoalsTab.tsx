import { ScrollView, StyleSheet } from "react-native";

export const ProjectGoalsTab = () => {
  return (
    <ScrollView style={styles.tabContent}>
      {/* Здесь будут цели проекта */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
});