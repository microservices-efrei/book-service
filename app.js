const express = require('express');
const sequelize = require('./src/config/database');
const dotenv = require('dotenv');
const indexRoutes = require('./src/routes/index');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Initialisation de la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((error) => {
    console.error('Impossible de se connecter à la base de données :', error);
    process.exit(1);
  });

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api', indexRoutes);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
