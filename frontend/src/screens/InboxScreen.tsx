import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { BASE_URL, MainColors, TextColors } from '@/constants';
import { router } from 'expo-router';
import { ModalItem } from '@src/components/ModalItem';

type notificationType = {
  id: string,
  user_id: string,
  notification_type: string,
  notification_title: string,
  notification_body: string,
  notification_data: string,
  is_read: boolean,
  created_at: Date,
}

export const InboxScreen = () => {
  const [isShowModalNotification, setIsShowModalNotification] = useState<boolean>(false);
  const [notificationsData, setNotificationsData] = useState<notificationType[]>([]);

  // Запрос уведомлений пользователя
  useEffect(() => {
    const inAppNotifications = getInAppNotifications();
  }, []);

  const getInAppNotifications = async () => {
    const response = await fetch(`${BASE_URL}/notification/in-app`);
    const data = await response.json();
    setNotificationsData(data);
  }

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // TODO: Просмотр уведомления
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerButton}>
          <TouchableOpacity onPress={handleBack}>
            <EvilIcons name="close" size={40} color={TextColors.dim_gray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Задача</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleSave}>
            <Ionicons name="checkmark" size={35} color={MainColors.pool_water} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {/* Список уведомлений */}
        {notificationsData && notificationsData.map((notification: notificationType) => (
          <View key={notification.id}>
            <Text>{notification.notification_title}</Text>
            <Text>{notification.notification_body}</Text>
          </View>
        ))}

        {/* Модальные окна */}
        <ModalItem
          isVisible={isShowModalNotification}
          onClose={() => { setIsShowModalNotification(false) }}
        >
          <View>
            <Text>Название уведомления</Text>
          </View>
        </ModalItem>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MainColors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: TextColors.dim_gray,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Century-Regular',
    color: TextColors.dire_wolf,
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
}); 