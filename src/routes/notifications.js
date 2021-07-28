const express = require('express');
const router = express.Router();
const controller = require('../controllers/notifications');
const authService = require('../services/auth');

const { hocError } = require('../errors/handler');

const authServiceWithError = hocError(authService.authorize);

router.put('/', authServiceWithError,  hocError(controller.updateToken));
router.get('/mine', authServiceWithError,  hocError(controller.getMySubscriptions));

module.exports = router
