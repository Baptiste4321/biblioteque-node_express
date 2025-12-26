# On part d'une image officielle Node.js (version 20 légère)
FROM node:20-alpine

# On définit le dossier de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# On copie d'abord les fichiers de dépendances (pour optimiser le cache Docker)
COPY package*.json ./

# On installe les dépendances
RUN npm install

# On copie le reste du code de l'application
COPY . .

# On expose le port sur lequel l'app tourne
EXPOSE 3001

# Commande de démarrage (utilise le script "dev" de ton package.json avec nodemon)
CMD ["npm", "run", "dev"]