const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Chemin vers votre configuration Sequelize

const Book = sequelize.define(
  'Book',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Génère automatiquement un UUID unique
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Le titre est obligatoire
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false, // L'auteur est obligatoire
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Une description facultative
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Indique si le livre est disponible pour emprunt
    },
    publishedYear: {
      type: DataTypes.INTEGER,
      allowNull: true, // Année de publication (facultatif)
      validate: {
        isInt: true, // Vérifie que c'est un entier
        min: 1000, // Une année plausible
        max: new Date().getFullYear(), // Pas dans le futur
      },
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true, // Genre du livre, ex: "Fantasy", "Science-fiction"
    },
  },
  {
    tableName: 'books', // Nom explicite de la table
    timestamps: true, // Inclut `createdAt` et `updatedAt` automatiquement
  }
);

module.exports = Book;
