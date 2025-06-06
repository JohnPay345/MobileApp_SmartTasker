export const RabbitMQ_Settings = {
  exchanges: [
    {
      "name": "notifications",
      "type": "direct",
      "durable": false
    }
  ],
  queues: [
    {
      "name": "notifications.push",
      "durable": true
    }
  ],
  bindings: [
    {
      "exchange": "notifications",
      "queue": "notifications.push",
      "routingKey": "notifications.push"
    }
  ]
}