const axios = require('axios'); // Pour envoyer des requêtes HTTP
const amqp = require('amqplib');
const { createBorrowing } = require('../controllers/borrowingController'); // Importer la fonction de création d'emprunt

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

// Fonction pour consommer les messages RabbitMQ
async function consumeMessagesFromQueue() {
  try {
    await connectRabbitMQ();

    const queue = 'borrowing_response_queue'; // Nom de la queue où le message est envoyé par book-service
    await channel.assertQueue(queue, { durable: true });

    console.log('En attente de messages dans la queue', queue);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const { userId, bookId } = JSON.parse(msg.content.toString());

        console.log(
          `Message reçu de la queue ${queue}:`,
          JSON.parse(msg.content.toString())
        );

        // Acquitter le message après traitement
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erreur lors de la consommation des messages:', error);
  }
}

async function startListening() {
  await consumeMessagesFromQueue();
}

module.exports = { consumeMessagesFromQueue, startListening };
