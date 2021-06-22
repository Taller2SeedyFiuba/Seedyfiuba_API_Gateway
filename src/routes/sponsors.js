const express = require('express');
const router = express.Router();
const controller = require('../controllers/sponsors');
const authService = require('../services/auth');

const { hocError } = require('../errors/handler');

const authServiceWithError = hocError(authService.authorize);

router.get('/mine', authServiceWithError,  hocError(controller.getMySponsors));

module.exports = router