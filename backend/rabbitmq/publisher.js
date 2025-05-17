import { RabbitMQ_Config } from './rabbitmq_config.js';

const pushQueue = 'notifications.push';
const inAppQueue = 'notifications.inapp';

const publishMessage = async (queue, message) => {
  try {
    const channel = await RabbitMQ_Config.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Sent message to ${queue}:`, message);
    await channel.close();
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}

export const publisher = {
  publishEvent: async (eventType, eventData) => {
    const message = { ...eventData, eventType };
    if (eventType.startsWith('task.') || eventType === 'manual.push') {
      await publishMessage(pushQueue, message);
    } else if (eventType.startsWith('contact.') || eventType === 'manual.inapp') {
      await publishMessage(inAppQueue, message);
    } else if (eventType.startsWith('project.')) {
      await publishMessage(pushQueue, message);
    } else {
      console.warn(`Unknown event type: ${eventType}`);
    }
  }
};