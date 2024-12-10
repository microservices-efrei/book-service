const amqp = require('amqplib');

const RABBITMQ_URI = 'amqp://micro-service:password@rabbitmq';

let connection;
let channel;

// Connexion RabbitMQ globale
async function connectRabbitMQ() {
  if (!connection) {
    try {
      connection = await amqp.connect(RABBITMQ_URI);
      channel = await connection.createChannel();
      console.log('Connexion à RabbitMQ établie');
    } catch (error) {
      console.error('Erreur lors de la connexion à RabbitMQ:', error);
      throw error; // Propage l'erreur si la connexion échoue
    }
  }
  return channel; // Retourne le canal pour l'utiliser dans d'autres fichiers
}

// Fonction pour envoyer un message à RabbitMQ
async function sendMessage(queue, message) {
  try {
    await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Message envoyé à la queue ${queue}:`, message);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
  }
}

// Fonction pour vérifier si l'utilisateur est authentifié
async function checkUserAuthentication(userId) {
  if (userId) {
    return true; // Retourne true si l'utilisateur est authentifié
  }
  return false;
}

// Fonction de vérification de l'utilisateur
async function handleUserVerification(userId) {
  try {
    const isAuthenticated = await checkUserAuthentication(userId);
    if (!isAuthenticated) {
      console.log(
        `L'utilisateur ${userId} n'est pas authentifié. Impossible d'emprunter.`
      );
      return false; // L'utilisateur n'est pas authentifié
    }
    console.log(
      `Utilisateur ${userId} vérifié avec succès, prêt pour l'emprunt.`
    );
    return true; // L'utilisateur est authentifié
  } catch (error) {
    console.error("Erreur lors de la vérification de l'utilisateur:", error);
    return false;
  }
}

module.exports = {
  sendMessage,
  connectRabbitMQ,
  handleUserVerification,
  channel,
};
