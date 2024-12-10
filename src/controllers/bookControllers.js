const amqp = require('amqplib');
const Book = require('../models/book');
const { sendJwtToken } = require('../middleware/jwt');

const RABBITMQ_URI = 'amqp://micro-service:password@rabbitmq'; // URI de RabbitMQ
const BORROWING_QUEUE = 'borrowing_queue'; // Queue pour envoyer les demandes de réservation

// Fonction pour envoyer un message à RabbitMQ
async function sendMessageToQueue(queue, message) {
  const connection = await amqp.connect(RABBITMQ_URI);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });

  // Envoi du message dans la queue
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`Message envoyé à la queue ${queue}:`, message);

  await channel.close();
  await connection.close();
}

// Route pour ajouter un livre
const createBook = async (req, res) => {
  try {
    const { title, author, description, genre } = req.body;
    const user = req.user; // L'utilisateur est extrait du token JWT

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à effectuer cette action.",
      });
    }

    // Validation des données
    if (!title || !author) {
      return res
        .status(400)
        .json({ message: "Le titre et l'auteur sont requis." });
    }

    // Création du livre
    const book = await Book.create({ title, author, description, genre });
    if (!book) {
      return res
        .status(500)
        .json({ message: "Erreur lors de l'ajout du livre." });
    }

    res.status(201).json({
      message: 'Livre ajouté avec succès',
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        isAvailable: book.isAvailable,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre:", error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Route pour obtenir la liste des livres
const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('Erreur lors de la récupération du livre:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    const { id } = req.params;
    const user = req.user; // L'utilisateur est extrait du token JWT

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à effectuer cette action.",
      });
    }

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }
    book.title = title;
    book.author = author;
    book.description = description;
    await book.save();
    res.status(200).json({
      message: 'Livre modifié avec succès',
      book: {
        id: book.id,
        title: book.title,
        description: book.description,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la modification du livre:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user; // L'utilisateur est extrait du token JWT

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à effectuer cette action.",
      });
    }

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }
    await book.destroy();
    res.status(200).json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du livre:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Route pour réserver un livre (envoie une demande à RabbitMQ)
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id; // L'ID de l'utilisateur est extrait du token JWT

    console.log('userId', userId);
    console.log('bookId', bookId);

    // Validation des données
    if (!userId || !bookId) {
      return res
        .status(400)
        .json({ message: "L'ID de l'utilisateur et du livre sont requis." });
    }

    // Vérification que le livre existe
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    const isAvailable = book.isAvailable;
    if (!isAvailable) {
      return res.status(400).json({ message: 'Le livre est déjà réservé.' });
    }

    const updateBook = await book.update({ isAvailable: false });

    if (!updateBook) {
      return res
        .status(500)
        .json({ message: 'Erreur lors de la réservation du livre.' });
    }

    // Préparer le message pour RabbitMQ
    const borrowRequest = {
      userId,
      bookId,
      isAvailable: false,
      token: sendJwtToken(res, req.user),
    };

    // Envoyer la demande de réservation à la queue RabbitMQ
    await sendMessageToQueue(BORROWING_QUEUE, borrowRequest);

    res.status(200).json({
      message: `Réservation du livre '${book.title}' envoyée avec succès.`,
    });
  } catch (error) {
    console.error('Erreur lors du retour du livre:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const setAvailableBook = async (bookId) => {
  const user = req.user;

  try {
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    const book = await Book.findOne({
      where: { id: bookId },
    });

    if (!borrowing) {
      return res.status(404).json({ message: 'Emprunt non trouvé.' });
    }

    book.isAvailable = true;

    await book.save();

    console.log('Livre disponible:', book);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'emprunt:", error.message);
    return null;
  }
};

module.exports = {
  createBook,
  updateBook,
  getBooks,
  getBook,
  borrowBook,
  deleteBook,
  setAvailableBook,
};
