const users = require('./users');
const projects = require('./projects');

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
}

module.exports = startRoutes;
