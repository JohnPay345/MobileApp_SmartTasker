import { RabbitMQ_Config } from '../rabbitmq_config.js';
import { sendToUser } from '../../service/websocket.js';
import { NotificationsModel } from "../../models/notifications.models.js";

const pushQueue = 'notifications.push';

const processPushNotification = async (msg) => {
  if (!msg) {
    console.log('No message received');
    return;
  }
  try {
    const notification = JSON.parse(msg.content.toString());
    console.log('Received push notification:', notification);

    const { userId, eventType, title, body, notificationsData } = notification;

    const result = await NotificationsModel.saveInAppNotification(userId, eventType, title, body, notificationsData);
    if (!result) {
      console.error('Failed to save in-app notification to database');
      return;
    }

    const websocketMessage = {
      type: 'new_notification',
      notification: {
        title: notification.title,
        body: notification.body,
        notificationId: result.notification_id
      }
    };
    sendToUser(notification.userId, websocketMessage);
  } catch (error) {
    console.error('Error processing push notification:', error);
  } finally {
    if (msg) {
      channel.ack(msg);
    }
  }
}

let channel;
export const pushConsumer = {
  startPushConsumer: async () => {
    try {
      channel = await RabbitMQ_Config.createChannel();
      await channel.assertQueue(pushQueue, { durable: true });
      channel.consume(pushQueue, processPushNotification);
      console.log('Waiting for in-app notifications...');
    } catch (error) {
      console.error('Error starting push consumer:', error);
    }
  },
};