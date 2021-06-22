const users = require('./users');
const projects = require('./projects');
const sponsors = require('./sponsors');
const favourites = require('./favourites');
const statusController = require('../controllers/status');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');

const startRoutes = (app) => {
  app.use('/users', users);

  app.use('/projects', projects)

  app.use('/sponsors', sponsors)

  app.use('/favourites', favourites)

  app.get('/status', statusController.getStatus);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customJs: '/static/loadFirebase.js',
    customCssUrl: '/static/loadFirebase.css',
  }));

  app.get('/fail', (req, res) => {
    return res.status(500).json({
      "status": "error",
      "error": "Intentional server error"
    });
  });

}

module.exports = startRoutes;
