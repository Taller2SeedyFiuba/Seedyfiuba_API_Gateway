const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const sponsorsController = require('../controllers/sponsors');
const viewersController = require('../controllers/viewers');
const notificationsController = require('../controllers/notifications');
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
router.delete('/:projectid([0-9]+)/favourites', authServiceWithError, hocError(sponsorsController.deleteFavourite));

router.get('/review', authServiceWithError, hocError(viewersController.getProjectsOnReview));
router.post('/:projectid([0-9]+)/review', authServiceWithError, hocError(viewersController.addProject));
router.post('/:projectid([0-9]+)/vote', authServiceWithError, hocError(viewersController.voteProject));

router.post('/:projectid([0-9]+)/notifications', authServiceWithError, hocError(notificationsController.subscribeToProject));
router.delete('/:projectid([0-9]+)/notifications', authServiceWithError, hocError(notificationsController.deleteSubscription));

module.exports = router;
