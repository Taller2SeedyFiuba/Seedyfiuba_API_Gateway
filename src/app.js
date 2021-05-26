const express = require('express');
const json = require('express').json;
const morgan = require('morgan');
const cors = require('cors');

//Importamos rutas/endpoints
const startRoutes = require("./routes");

//Importamos handlers de error
const { notDefinedHandler, errorHandler} = require("./errors/handler");

function start(database){

    //Iniciamos la aplicacion
    const app = express();

    //Middlewares
    app.use(morgan('dev')); //Escupir a archivo con una ip y timestamp.
    app.use(json());
    app.use(cors());

    //Deshabilitamos el parseo de querys
    app.disable('query parser')

    //Rutas
    startRoutes(app);

    app.use(notDefinedHandler);
    app.use(errorHandler);

    return app;
}

module.exports = { start };
