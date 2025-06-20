import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Images, MainColors, TextColors } from '@/constants';
import { router } from 'expo-router';
import { HeaderEditor } from '@src/components/HeaderEditor';
import { EvilIcons } from '@expo/vector-icons';

type registerInfoType = {
  firstName: string,
  middleName: string,
  telephone: string,
  email: string,
  password: string,
  confirmPassword: string
}

const defaultRegisterInfo = {
  firstName: '',
  middleName: '',
  telephone: '',
  email: '',
  password: '',
  confirmPassword: ''
}

export const RegisterScreen = () => {
  const [registerInfo, setRegisterInfo] = useState<registerInfoType>(defaultRegisterInfo);

  const updateRegisterInfo = (key: string, value: string) => {
    const keyName: string = Object.prototype.hasOwnProperty.call(registerInfo, key) ? key : '';
    if (!keyName) {
      console.error(`Key ${key} doesn't exists`)
      return;
    }
    setRegisterInfo(prevState => ({ ...prevState, [keyName]: value }))
  }

  const handleBack = async () => {
    router.push('/(auth)/login')
  }

  const handleRegister = async () => {
    if (registerInfo.password !== registerInfo.confirmPassword) {
      return;
    }
    router.replace('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerButton}>
          <TouchableOpacity onPress={handleBack}>
            <EvilIcons name="close" size={40} color={TextColors.snowbank} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Регистрация</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Image source={Images.logo} style={styles.logo} />
          <Text style={styles.title}>SmartTasker</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Фамилия"
              placeholderTextColor={TextColors.lunar_base}
              value={registerInfo.firstName}
              onChange={(e) => updateRegisterInfo('firstName', e.nativeEvent.text)}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Имя"
              placeholderTextColor={TextColors.lunar_base}
              value={registerInfo.middleName}
              onChange={(e) => updateRegisterInfo('middleName', e.nativeEvent.text)}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Телефон"
              placeholderTextColor={TextColors.lunar_base}
              value={registerInfo.telephone}
              onChange={(e) => updateRegisterInfo('telephone', e.nativeEvent.text)}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={TextColors.lunar_base}
              value={registerInfo.email}
              onChange={(e) => updateRegisterInfo('email', e.nativeEvent.text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor={TextColors.lunar_base}
              value={registerInfo.password}
              onChange={(e) => updateRegisterInfo('password', e.nativeEvent.text)}
              secureTextEntry
            />
            {registerInfo.password ? <TextInput
              style={styles.input}
              placeholder="Подтвердите пароль"
              placeholderTextColor={TextColors.lunar_base}
              value={registerInfo.confirmPassword}
              onChange={(e) => updateRegisterInfo('confirmPassword', e.nativeEvent.text)}
              secureTextEntry
            /> : null}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: TextColors.snowbank,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Century-Regular',
    color: TextColors.snowbank,
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToLogin: {
    marginTop: 15,
    marginLeft: 15
  },
  container: {
    flex: 1,
    backgroundColor: MainColors.pool_water,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Century-Regular',
    color: TextColors.snowbank,
    marginBottom: 30,
  },
  form: {
    width: '100%',
    gap: 15,
  },
  input: {
    backgroundColor: MainColors.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Century-Regular',
    width: '100%',
  },
  registerButton: {
    backgroundColor: MainColors.herbery_honey,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: TextColors.dim_gray,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Century-Regular'
  }
});