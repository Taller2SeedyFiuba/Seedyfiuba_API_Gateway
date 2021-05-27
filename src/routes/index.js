const users = require('./users');
const projects = require('./projects');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');

const startRoutes = (app) => {
  app.use('/users', users);

  app.use('/projects', projects)

  app.get('/status', (req, res) => {
    return res.status(200).json({
      "status": "success",
      "data": {
        "users": "OK"
      }
    });
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = startRoutes;
