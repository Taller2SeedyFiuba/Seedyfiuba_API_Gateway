const express = require('express');
const router = express.Router();
const controller = require('../controllers/projects');
const authService = require('../services/auth');

const { hocError } = require('../errors/handler');

const authServiceWithError = hocError(authService.authorize);

router.get('/search', authServiceWithError,  hocError(controller.search));
router.get('/view/:id', authServiceWithError, hocError(controller.view));
router.post('/:id', authServiceWithError, hocError(controller.create));
router.put('/:id', authServiceWithError, hocError(controller.update));

/** RUTAS QUE NECESITAMOS
 * 
 * Ver mis proyectos                ->  GET /mine           <- Esta contenida en la siguiente.
 * Filtrar proyectos (busqueda)     ->  GET /search
 * Ver un proyecto por id.          ->  GET /view/:id
 * Crear un proyecto propio         ->  POST /:id
 * Cancelar un proyecto propio                              <- Por ahora no sabemos como cancelar un proyecto
 * Modificar un proyecto propio     ->  PUT /:id
 * 
 * */


module.exports = router;