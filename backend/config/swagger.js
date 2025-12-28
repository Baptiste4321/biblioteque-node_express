const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de ton API Express',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  //apis: ['./routes/*.js'],
    apis: [],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };