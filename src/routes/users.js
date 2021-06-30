
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const projectController = require('../controllers/projects');
const walletController = require('../controllers/wallets');

const authService = require('../services/auth');

const { hocError } = require('../errors/handler');

const authServiceWithError = hocError(authService.authorize);

//Users
router.post('/', authServiceWithError, hocError(userController.post));
router.get('/me', authServiceWithError,  hocError(userController.me));
router.patch('/me', authServiceWithError, hocError(userController.updateMyProfile));


//User's wallet
router.get('/wallets/mine', authServiceWithError,  hocError(walletController.mine));


router.get('/:id/profile', authServiceWithError,  hocError(userController.getUser));

//User's projects
router.get('/:id/projects', authServiceWithError,  hocError(projectController.getUserProjects));
router.get('/projects/mine', authServiceWithError,  hocError(projectController.getMyProjects));


module.exports = router;