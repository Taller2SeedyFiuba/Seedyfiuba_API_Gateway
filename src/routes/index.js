const users = require('./users');

//Permite atrapar errores sin necesidad de try catch

const startRoutes = (app) => {
  app.use('/users', users);

  app.get('/status', (req, res) => {
    return res.status(200).json({
      "users": "OK"
    });
  });
}

module.exports = startRoutes;
