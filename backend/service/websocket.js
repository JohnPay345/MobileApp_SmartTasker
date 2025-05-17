import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';

const users = {};

export const setupWebsocketServer = (fastify) => {
  const wss = new WebSocketServer({ server: fastify.server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    // TODO: Реализовать логику взятия userId через токены
    const userId = req.url.substring(req.url.lastIndexOf('/') + 1);
    console.log(userId);
    if (!userId) {
      console.warn('Websocket connection without user ID.');
      ws.close();
      return;
    }

    users[userId] = ws;
    console.log(`Client connected: ${userId}`);

    ws.on('close', () => {
      console.log(`Client disconnected: ${userId}`);
      delete users[userId];
    });

    ws.on('error', (error) => {
      console.error(`Websocket error for ${userId}:`, error);
      delete users[userId];
    });
  });
  return wss;
}

export const sendToUser = (userId, message) => {
  const ws = users[userId];
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify(message));
      console.log(`Sent to user ${userId}:`, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  } else {
    console.log(`User ${userId} not connected or WebSocket not open.`);
  }
}
