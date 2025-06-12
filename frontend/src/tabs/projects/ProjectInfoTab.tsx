import { ScrollView, StyleSheet } from "react-native";

export const ProjectInfoTab = () => {
  return (
    <ScrollView style={styles.tabContent}>
      {/* Здесь будет информация о проекте */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
});