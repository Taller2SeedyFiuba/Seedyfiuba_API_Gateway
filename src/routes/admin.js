const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const projectsController = require('../controllers/projects');
const authService = require('../services/auth');
const { adminValidation } = require('../services/admin');

const { hocError } = require('../errors/handler');

const validations = [
    hocError(authService.authorize), 
    hocError(adminValidation)
]

router.patch('/users/:id',  validations, hocError(usersController.adminPromoteUser));
router.get('/users', validations, hocError(usersController.adminListUsers));
router.get('/users/:id', validations, hocError(usersController.adminGetUser));
router.get('/projects/', validations, hocError(projectsController.adminListProjects));
router.get('/projects/:projectid([0-9]+)', validations, hocError(projectsController.adminGetProject));

module.exports = router;

/* 
- Listar usuarios del sistema           -> GET  /admin/users
- Visualizar perfil de usuario          -> GET  /admin/users/{uid} 
- Listado de proyectos                  -> GET  /admin/projects
- Visualizacion de proyecto             -> GET  /admin/projects/{pid}
- Listado de servidores                 -> GET  /admin/servers
- Visualizacion de servidor             -> GET  /admin/servers/???
- Metricas de usuarios                  -> GET  /admin/metrics/users
- Metricas de proyectos                 -> GET  /admin/metrics/projects
*/