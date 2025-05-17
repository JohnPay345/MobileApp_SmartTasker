import { RabbitMQ_Configuration } from "./rabbitmq_constants";
import { RabbitMQ_Config } from "./rabbitmq_config";
import { config } from "dotenv";

config();

export const createResources = async () => {
  const connection = await RabbitMQ_Config.connectRabbitMQ();
  const channel = await RabbitMQ_Config.createChannel();
  try {
    for (const exchange of RabbitMQ_Configuration.exchanges) {
      await channel.assertExchange(exchange.name, exchange.type, { durable: exchange.durable });
      console.log(`Exchange "${exchange.name}" created`);
    }

    for (const queue of RabbitMQ_Configuration.queues) {
      await channel.assertQueue(queue.name, { durable: queue.durable });
      console.log(`Queue "${queue.name}" created`);
    }

    for (const binding of RabbitMQ_Configuration.bindings) {
      await channel.bindQueue(binding.queue, binding.exchange, binding.routingKey);
      console.log(`Binding queue "${binding.queue}" to exchange "${binding.exchange}" with routing key "${binding.routingKey}" created`);
    }

  } catch (error) {
    console.error('Error creating resources:', error);
  } finally {
    if (channel) await channel.close();
    if (connection) await connection.close();
  }
}
