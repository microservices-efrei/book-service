# Utiliser une image de base Node.js officielle
FROM node:18

# Créer et définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source dans le conteneur
COPY . .

# Exposer le port sur lequel l'app écoute
EXPOSE 3003

# Démarrer l'application

CMD ["npm", "start"]
