const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const sponsorsController = require('../controllers/sponsors');
const viewersController = require('../controllers/viewers');
const authService = require('../services/auth');

const { hocError } = require('../errors/handler');

const authServiceWithError = hocError(authService.authorize);

router.get('/search', authServiceWithError, hocError(projectsController.search));
router.get('/:id([0-9]+)', authServiceWithError, hocError(projectsController.view));
router.post('/', authServiceWithError, hocError(projectsController.create));
router.patch('/:id([0-9]+)', authServiceWithError, hocError(projectsController.update));
router.delete('/:id([0-9]+)', authServiceWithError, hocError(projectsController.destroy));

router.post('/:projectid([0-9]+)/sponsors', authServiceWithError, hocError(sponsorsController.addSponsor));
router.post('/:projectid([0-9]+)/favourites', authServiceWithError, hocError(sponsorsController.addFavourite));

router.get('/review', authServiceWithError, hocError(viewersController.getProjectsOnReview));
router.post('/:projectid([0-9]+)/review', authServiceWithError, hocError(viewersController.addProject));

module.exports = router;


/*
- Darse de alta como veedor en el sistema                                                       -> POST /viewers
- Listar proyectos en estado 'on_review'                                                        -> GET  /projects/review
- Solicitar ser veedor de un proyecto (esto automaticamente seria una aceptacion del proyecto?) -> POST /projects/{id}/viewers
- Ver mis proyectos veedados.                                                                   -> GET  /viewers/mine
- Votar a favor de un proyecto (posible cambio de estado).                                      -> POST /projects/{id}/vote
*/