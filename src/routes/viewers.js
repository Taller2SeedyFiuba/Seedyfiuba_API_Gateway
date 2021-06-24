const express = require('express');
const router = express.Router();
const controller = require('../controllers/viewers');
const authService = require('../services/auth');

const { hocError } = require('../errors/handler');

const authServiceWithError = hocError(authService.authorize);

router.post('/', authServiceWithError,  hocError(controller.subscribeToViewing));
router.get('/mine', authServiceWithError,  hocError(controller.getMyReviews));

module.exports = router