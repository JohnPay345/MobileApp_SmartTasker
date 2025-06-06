import { webSocketService } from '#rmq/service/websocket.js';
import { RabbitMQ_Config } from '#rmq/rabbitmq_config.js';
import { NotificationsModel } from "#/models/notifications.models.js";

const pushQueue = 'notifications.push';

const publishMessage = async (type, action, message) => {
  try {
    if (message == null || message == "" || queue == "" || queue == null) {
      console.log('Message and queue must be filled!');
      return;
    }
    const userId = message.data.userId;
    if (webSocketService.isUserConnected(userId)) {
      const result = await NotificationsModel.saveInAppNotification(message.data);
      if (!result) {
        console.error('Failed to save in-app notification to database');
        return;
      }
      const websocketMessage = {
        type: type,
        action: action,
        notification: {
          notificationId: result.notification_id,
          title: message.data.title,
          body: message.data.body
        }
      };
      webSocketService.sendNotification(userId, websocketMessage);
    } else {
      const channel = RabbitMQ_Config.chanel;
      await channel.assertQueue(pushQueue, { durable: true });
      channel.sendToQueue(pushQueue, Buffer.from(JSON.stringify(notification)));
      console.log(`Sent message to ${pushQueue}:`, notification);
      await channel.close();
    }
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}
