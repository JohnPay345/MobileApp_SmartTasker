import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SplashScreen() {
  const logoIcon = require("@/assets/Logo-Icon-Application.png")

  return (
    <View style={styles.container}>
      <Image source={logoIcon} style={styles.icon} />
      <Text style={styles.title}>SmartTasker</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0096FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'serif',
    letterSpacing: 1,
  },
});