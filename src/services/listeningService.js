// Démarre l'écoute des messages RabbitMQ
const {
  consumeMessagesFromCancelBorrowingQueue,
} = require('./CancelBorrowingService');
const { consumeMessagesFromReturnBookQueue } = require('./ReturnBookService');

async function startListening() {
  await consumeMessagesFromCancelBorrowingQueue();
  await consumeMessagesFromReturnBookQueue();
}

module.exports = { startListening };
