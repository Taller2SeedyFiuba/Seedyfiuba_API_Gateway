const users = require('./users');

const startRoutes = (app) => {
  app.use('/users', users);

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
