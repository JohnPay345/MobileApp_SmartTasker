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
      "name": "notifications_push",
      "durable": true
    },
    {
      "name": "notifications_inapp",
      "durable": true
    },
  ],
  bindings: [
    {
      "exchange": "notifications",
      "queue": "notifications_push",
      "routingKey": "notifications.push"
    },
    {
      "exchange": "notifications",
      "queue": "notifications_inapp",
      "routingKey": "notifications.inapp"
    },
  ]
}