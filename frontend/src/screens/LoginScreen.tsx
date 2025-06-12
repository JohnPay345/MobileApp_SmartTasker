import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Images, MainColors, TextColors } from '@/constants';
import { RelativePathString, router } from 'expo-router';
import { useSettings } from '@src/context/SettingsContext';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { defaultScreen } = useSettings();

  const handleLogin = () => {
    // TODO: Добавить логику авторизации
    router.replace(defaultScreen as RelativePathString || '/tasks');
  };

  const handleRegister = () => {
    router.replace('/(auth)/register');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image source={Images.logo} style={styles.logo} />
        <Text style={styles.title}>SmartTasker</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={TextColors.lunar_base}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            placeholderTextColor={TextColors.lunar_base}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Войти</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addOptionsLogin}>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerText}>Регистрация</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Сбросить пароль</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MainColors.pool_water,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Century-Regular',
    color: TextColors.snowbank,
    marginBottom: 40,
  },
  form: {
    width: '100%',
    gap: 15,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: MainColors.pixel_white,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'Century-Regular'
  },
  loginButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: MainColors.herbery_honey,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    fontFamily: 'Century-Regular',
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.lunar_base,
  },
  addOptionsLogin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  registerText: {
    fontFamily: 'Century-Regular',
    fontSize: 14,
    color: TextColors.snowbank,
  },
  forgotPasswordText: {
    fontFamily: 'Century-Regular',
    fontSize: 14,
    color: TextColors.snowbank,
  },
});