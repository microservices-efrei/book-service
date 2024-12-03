const axios = require('axios'); // Pour envoyer des requêtes HTTP
const amqp = require('amqplib');

const RABBITMQ_URI = 'amqp://micro-service:password@rabbitmq';
let connection;
let channel;

async function connectRabbitMQ() {
  if (!connection) {
    connection = await amqp.connect(RABBITMQ_URI);
    channel = await connection.createChannel();
    console.log('Connexion à RabbitMQ établie');
  }
}

async function startListening() {
  await connectRabbitMQ();
}

module.exports = { startListening };
