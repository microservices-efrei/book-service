const amqp = require('amqplib');

const RABBITMQ_URI = 'amqp://micro-service:password@rabbitmq';
// const USER_CHECK_QUEUE = 'user_check_queue';
// const USER_RESPONSE_QUEUE = 'user_response_queue';

// Fonction pour envoyer un message à RabbitMQ
async function sendMessageToQueue(queue, message) {
  const connection = await amqp.connect(RABBITMQ_URI);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`Message envoyé à la queue ${queue}:`, message);
  await channel.close();
  await connection.close();
}

// Fonction pour écouter une queue et traiter les messages
async function listenToQueue(queue, callback) {
  const connection = await amqp.connect(RABBITMQ_URI);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });
  console.log(`En attente de messages dans la queue ${queue}...`);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const message = JSON.parse(msg.content.toString());
      callback(message);
      channel.ack(msg);
    }
  });
}

module.exports = {
  sendMessageToQueue,
  listenToQueue,
};
