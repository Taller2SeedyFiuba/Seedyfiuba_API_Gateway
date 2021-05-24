
const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const authService = require('../services/auth.service');

router.get('/me', authService.authorize,  controller.me);
router.post('/', authService.authorize, controller.post);

module.exports = router;