const { connectRabbitMQ } = require('./rabbitmqService');
const Book = require('../models/book');

// Fonction pour consommer les messages RabbitMQ et traiter les annulations d'emprunt
async function consumeMessagesFromCancelBorrowingQueue() {
  try {
    const channel = await connectRabbitMQ();

    const queue = 'returning_book_queue';
    await channel.assertQueue(queue, { durable: true });

    console.log('En attente de messages dans la queue', queue);

    channel.consume(
      queue,
      async (msg) => {
        if (msg !== null) {
          try {
            const data = JSON.parse(msg.content.toString());
            const { bookId, borrowingId } = data;

            console.log('Message reçu:', data);

            // Validation des données
            if (!bookId || !borrowingId) {
              console.error(
                'Message invalide : bookId ou borrowingId manquant'
              );
              channel.ack(msg); // Acquitter le message pour éviter le blocage
              return;
            }

            console.log(`Traitement du retour du livre ${bookId}`);

            // Vérifier si le livre existe
            const book = await Book.findOne({ where: { id: bookId } });
            if (!book) {
              console.log(`Le livre avec l'ID ${bookId} n'existe pas.`);
              channel.ack(msg);
              return;
            }

            // Mettre à jour la disponibilité du livre
            book.isAvailable = true;
            const result = await book.save();

            if (result) {
              console.log(`Livre ${bookId} marqué comme retourné.`);
            } else {
              console.error(
                'Erreur lors de la mise à jour de la disponibilité du livre.'
              );
            }

            // Acquitter le message après traitement
            channel.ack(msg);
          } catch (error) {
            console.error('Erreur lors du traitement du message :', error);
            channel.ack(msg); // Toujours acquitter le message, même en cas d'erreur
          }
        }
      },
      { noAck: false } // Assure que les messages sont acquittés manuellement
    );
  } catch (error) {
    console.error('Erreur lors de la consommation des messages :', error);
  }
}

module.exports = { consumeMessagesFromCancelBorrowingQueue };
