import { RabbitMQ_Config } from '../rabbitmq_config.js';
import { webSocketService } from '../../service/websocket.js';
import { NotificationsModel } from "../../models/notifications.models.js";

const pushQueue = 'notifications.push';

const processPushNotification = async (msg) => {
  if (!msg) {
    console.log('No message received');
    return;
  }
  try {
    const notificationData = JSON.parse(msg.data.toString());
    console.log('Received push notification:', notificationData);
    // TODO: Отправка сервером push-уведомления firebase (FCM)
  } catch (error) {
    console.error('Error processing push notification:', error);
  } finally {
    if (msg) {
      channel.ack(msg);
    }
  }
}

export const pushConsumer = {
  startPushConsumer: async () => {
    try {
      const channel = await RabbitMQ_Config.createChannel();
      await channel.assertQueue(pushQueue, { durable: true });
      channel.consume(pushQueue, processPushNotification);
      console.log('Waiting for push notifications...');
    } catch (error) {
      console.error('Error starting push consumer:', error);
    }
  },
};