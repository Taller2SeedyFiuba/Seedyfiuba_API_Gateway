const express = require('express');
const path = require('path');
const json = require('express').json;
const morgan = require('morgan');
const cors = require('cors');
const { log } = require('./config')

//Importamos rutas/endpoints
const startRoutes = require("./routes");

//Importamos handlers de error
const { notDefinedHandler, errorHandler} = require("./errors/handler");

function createApp(){

    //Iniciamos la aplicacion
    const app = express();

    //Middlewares
    if(log.info){
      app.use(morgan(function (tokens, req, res) {
        return [
          'Info:',
          tokens.method(req, res),
          tokens.url(req, res), '-',
          tokens.status(req, res), '-',
          tokens['response-time'](req, res), 'ms'
        ].join(' ')
      }));
    }
    app.use(json());
    app.use(cors());

    //Rutas
    startRoutes(app);
    app.use('/static', express.static(path.join(__dirname, 'public')));

    app.use(notDefinedHandler);
    app.use(errorHandler);
    return app;
}

module.exports = { createApp };
