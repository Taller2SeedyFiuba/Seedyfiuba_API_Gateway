const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const sponsorsController = require('../controllers/sponsors');
const authService = require('../services/auth');

const { hocError } = require('../errors/handler');

const authServiceWithError = hocError(authService.authorize);

router.get('/search', authServiceWithError,  hocError(projectsController.search));
router.get('/:id([0-9]+)', authServiceWithError, hocError(projectsController.view));
router.post('/', authServiceWithError, hocError(projectsController.create));
router.patch('/:id([0-9]+)', authServiceWithError, hocError(projectsController.update));
router.delete('/:id([0-9]+)', authServiceWithError, hocError(projectsController.destroy));

router.post('/:projectid([0-9]+)/sponsors', authServiceWithError,  hocError(sponsorsController.addSponsor));

router.post('/:projectid([0-9]+)/favourites', authServiceWithError,  hocError(sponsorsController.addFavourite));

module.exports = router;
