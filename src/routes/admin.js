const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const projectsController = require('../controllers/projects');
const authService = require('../services/auth');
const { adminValidation } = require('../services/admin');

const { hocError } = require('../errors/handler');
const { getMetrics } = require('../controllers/metrics');

const validations = [
    hocError(authService.authorize),
    hocError(adminValidation)
]

router.patch('/users/:id',  validations, hocError(usersController.adminPromoteUser));
router.get('/users', validations, hocError(usersController.adminListUsers));
router.get('/users/:id', validations, hocError(usersController.adminGetUser));
router.get('/projects/', validations, hocError(projectsController.adminListProjects));
router.get('/projects/:projectid([0-9]+)', validations, hocError(projectsController.adminGetProject));
router.get('/metrics', validations, hocError(getMetrics));


module.exports = router;
