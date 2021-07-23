const users = require('./users');
const projects = require('./projects');
const sponsors = require('./sponsors');
const favourites = require('./favourites');
const viewers = require('./viewers');
const admins = require('./admin');
const statusController = require('../controllers/status');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');

const startRoutes = (app) => {
  app.use('/users', users);

  app.use('/projects', projects)

  app.use('/sponsors', sponsors)

  app.use('/favourites', favourites)

  app.use('/viewers', viewers)

  app.use('/admin', admins)

  app.get('/status', statusController.getStatus);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customJs: '/static/loadFirebase.js',
    customCssUrl: '/static/loadFirebase.css',
  }));

}

module.exports = startRoutes;
