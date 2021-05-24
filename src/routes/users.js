
const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const authService = require('../services/auth');

const { hocError } = require('../errors/handler');

const authServiceWithError = hocError(authService.authorize);

router.get('/me', authServiceWithError,  hocError(controller.me));
router.post('/', authServiceWithError, hocError(controller.post));

module.exports = router;